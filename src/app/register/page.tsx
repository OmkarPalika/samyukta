'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Users, Star, ArrowRight, ChevronLeft, Upload, User as UserIcon, CreditCard, FileText, Clock, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { RegistrationFormData, CompletedRegistrationData } from "@/lib/types";
import { uploadFile, validateFile } from "@/lib/file-upload";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Register() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('samyukta_registration_step');
      return saved ? parseInt(saved, 10) : 1;
    }
    return 1;
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<{
    remaining_cloud: number;
    remaining_ai: number;
    remaining_total: number;
    remaining_hackathon?: number;
    remaining_pitch?: number;
    cloud_closed?: boolean;
    ai_closed?: boolean;
    hackathon_closed?: boolean;
    pitch_closed?: boolean;
    event_closed?: boolean;
  } | null>(null);

  const [completedRegistration, setCompletedRegistration] = useState<CompletedRegistrationData | null>(null);

  const [formData, setFormData] = useState<RegistrationFormData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('samyukta_registration_form');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Don't restore screenshot file object
          if (parsed.payment?.screenshot) {
            parsed.payment.screenshot = null;
          }
          return parsed;
        } catch {
          console.error('Failed to parse saved form data');
        }
      }
    }
    return {
      college: "",
      customCollege: "",
      teamSize: 1,
      members: [
        {
          fullName: "",
          email: "",
          whatsapp: "",
          year: "",
          department: "",
          accommodation: false,
          foodPreference: "veg",
          isClubLead: false,
          clubName: ""
        }
      ],
      tickets: {
        combo: false,
        workshop: "",
        competition: ""
      },
      memberTracks: [],
      payment: {
        transactionId: "",
        screenshot: null
      }
    };
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/registrations/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();

    // Initialize memberTracks array
    if (formData.memberTracks.length === 0) {
      setFormData(prev => ({
        ...prev,
        memberTracks: Array(prev.teamSize).fill(null).map(() => ({
          workshopTrack: "",
          competitionTrack: ""
        }))
      }));
    }
  }, [formData.memberTracks.length]);

  const steps = [
    { id: 1, title: "College & Team", icon: Users },
    { id: 2, title: "Team Details", icon: UserIcon },
    { id: 3, title: "Ticket Selection", icon: FileText },
    { id: 4, title: "Member Tracks", icon: Star },
    { id: 5, title: "Payment", icon: CreditCard },
    { id: 6, title: "Confirmation", icon: Check }
  ];

  const colleges = ["ANITS", "Other"];
  const years = ["1st", "2nd", "3rd", "4th", "5th"];
  const departments = ["CSE", "CSM", "CSD", "IT", "Cybersecurity", "Other"];

  const calculatePrice = () => {
    let basePrice = 0;
    const breakdown: { item: string; price: number }[] = [];

    if (formData.tickets.combo) {
      basePrice = formData.tickets.competition === "Hackathon" ? 950 : 900;
      breakdown.push({
        item: `Combo Pass (${formData.tickets.competition || "Pitch"})`,
        price: basePrice
      });
    } else {
      basePrice = 800;
      breakdown.push({ item: "Entry + Workshop Pass", price: 800 });

      if (formData.tickets.competition) {
        const competitionPrice = formData.tickets.competition === "Hackathon" ? 150 : 100;
        basePrice += competitionPrice;
        breakdown.push({
          item: `${formData.tickets.competition} Entry`,
          price: competitionPrice
        });
      }
    }

    const teamDiscount = (formData.tickets.combo && formData.teamSize > 1) ? formData.teamSize * 10 : 0;
    const totalForTeam = (basePrice * formData.teamSize) - teamDiscount;

    return { breakdown, teamDiscount, totalForTeam, basePrice };
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.college) newErrors.college = "Please select a college";
        if (formData.college === "Other" && !formData.customCollege) {
          newErrors.customCollege = "Please enter your college name";
        }
        break;

      case 2:
        formData.members.forEach((member, index) => {
          if (!member.fullName) newErrors[`member${index}Name`] = "Name is required";
          if (!member.email) newErrors[`member${index}Email`] = "Email is required";
          if (!member.whatsapp) newErrors[`member${index}Phone`] = "WhatsApp number is required";
          if (!member.year) newErrors[`member${index}Year`] = "Year is required";
          if (!member.department) newErrors[`member${index}Department`] = "Department is required";

          // Validate phone number (10 digits)
          if (member.whatsapp && !/^\d{10}$/.test(member.whatsapp)) {
            newErrors[`member${index}Phone`] = "Enter valid 10-digit phone number";
          }

          // Validate email
          if (member.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
            newErrors[`member${index}Email`] = "Enter valid email address";
          }
        });
        break;

      case 4:
        formData.memberTracks.forEach((track, index) => {
          if (!track.workshopTrack) {
            newErrors[`member${index}Workshop`] = "Workshop track is required";
          }
          if (formData.tickets.combo && !track.competitionTrack) {
            newErrors[`member${index}Competition`] = "Competition track is required for combo pass";
          }
        });
        break;

      case 5:
        if (!formData.payment.transactionId) {
          newErrors.transactionId = "Transaction ID is required";
        }
        if (!formData.payment.screenshot) {
          newErrors.paymentScreenshot = "Payment screenshot is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextStep = Math.min(currentStep + 1, 6);
      setCurrentStep(nextStep);
      localStorage.setItem('samyukta_registration_step', nextStep.toString());
    }
  };

  const handlePrevious = () => {
    const prevStep = Math.max(currentStep - 1, 1);
    setCurrentStep(prevStep);
    localStorage.setItem('samyukta_registration_step', prevStep.toString());
  };

  const handleTeamSizeChange = (size: number) => {
    const newMembers = [...formData.members];
    const newMemberTracks = [...formData.memberTracks];

    if (size > formData.teamSize) {
      // Add new members
      for (let i = formData.teamSize; i < size; i++) {
        newMembers.push({
          fullName: "",
          email: "",
          whatsapp: "",
          year: "",
          department: "",
          accommodation: false,
          foodPreference: "veg" as "veg" | "non-veg",
          isClubLead: false,
          clubName: ""
        });
        newMemberTracks.push({
          workshopTrack: "",
          competitionTrack: ""
        });
      }
    } else if (size < formData.teamSize) {
      // Remove members
      newMembers.splice(size);
      newMemberTracks.splice(size);
    }

    const newFormData = {
      ...formData,
      teamSize: size,
      members: newMembers,
      memberTracks: newMemberTracks
    };
    setFormData(newFormData);
    localStorage.setItem('samyukta_registration_form', JSON.stringify(newFormData));
  };

  const handleMemberChange = (index: number, field: string, value: string | boolean) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    const newFormData = { ...formData, members: newMembers };
    setFormData(newFormData);
    localStorage.setItem('samyukta_registration_form', JSON.stringify(newFormData));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setLoading(true);
    try {
      const teamId = `team-${Date.now()}`;
      let paymentScreenshotUrl = "";

      // Upload payment screenshot if available
      if (formData.payment.screenshot) {
        try {
          validateFile(formData.payment.screenshot);
          const uploadResult = await uploadFile(formData.payment.screenshot, '/api/registrations/upload-payment');
          paymentScreenshotUrl = uploadResult.file_url;
        } catch (uploadError) {
          console.error("Payment screenshot upload failed:", uploadError);
          // Continue registration without screenshot for now
          paymentScreenshotUrl = "upload_failed";
        }
      }

      const membersData = formData.members.map((member, index) => ({
        participant_id: `${teamId}-${index + 1}`,
        passkey: Math.random().toString(36).substring(2, 8).toUpperCase(),
        full_name: member.fullName,
        email: member.email,
        whatsapp: member.whatsapp,
        year: member.year,
        department: member.department,
        accommodation: member.accommodation || false,
        food_preference: member.foodPreference,
        workshop_track: formData.memberTracks[index]?.workshopTrack || "",
        competition_track: formData.memberTracks[index]?.competitionTrack || "",
        is_club_lead: member.isClubLead || false,
        club_name: member.clubName || ""
      }));

      // Determine primary workshop track (most common among members)
      const workshopTracks = formData.memberTracks.map(t => t.workshopTrack).filter(Boolean);
      const primaryWorkshop = workshopTracks.length > 0 ?
        (workshopTracks.includes("Cloud Computing (AWS)") ? "Cloud" : "AI") : "None";

      // Determine primary competition track
      const competitionTracks = formData.memberTracks.map(t => t.competitionTrack).filter(Boolean);
      const primaryCompetition = competitionTracks.length > 0 ?
        (competitionTracks.includes("Hackathon") ? "Hackathon" : "Pitch") : "None";

      const registrationData = {
        college: formData.college === "Other" ? formData.customCollege : formData.college,
        members: membersData,
        ticket_type: (formData.tickets.combo ? "Combo" : "Custom") as "Combo" | "Custom",
        workshop_track: primaryWorkshop as "Cloud" | "AI" | "None",
        competition_track: primaryCompetition as "Hackathon" | "Pitch" | "None",
        total_amount: calculatePrice().totalForTeam,
        transaction_id: formData.payment.transactionId,
        payment_screenshot_url: paymentScreenshotUrl
      };

      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          // Handle duplicate email errors
          if (errorData.duplicate_emails) {
            const newErrors: Record<string, string> = {};
            formData.members.forEach((member, index) => {
              if (errorData.duplicate_emails.includes(member.email)) {
                newErrors[`member${index}Email`] = "This email is already registered";
              }
            });
            setErrors(newErrors);
            setCurrentStep(2); // Go back to member details step
            setLoading(false);
            return;
          }
          // Handle other errors like slot availability
          setErrors({ submit: errorData.error });
          setLoading(false);
          return;
        }
        throw new Error(errorData.details || 'Registration failed');
      }
      
      const result = await response.json();
      setCompletedRegistration({ ...registrationData, team_id: result.team_id } as CompletedRegistrationData);
      setCurrentStep(6);
      // Clear saved data on successful registration
      localStorage.removeItem('samyukta_registration_form');
      localStorage.removeItem('samyukta_registration_step');
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({ submit: "Registration failed. Please try again." });
    }
    setLoading(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-white text-lg mb-4 block">College/University</Label>
              <RadioGroup
                value={formData.college}
                onValueChange={(value) => {
                  const newFormData = { ...formData, college: value };
                  setFormData(newFormData);
                  localStorage.setItem('samyukta_registration_form', JSON.stringify(newFormData));
                }}
              >
                {colleges.map((college) => (
                  <div key={college} className="flex items-center space-x-3">
                    <RadioGroupItem value={college} id={college} />
                    <Label htmlFor={college} className="text-gray-300 text-lg">{college}</Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.college && <p className="text-red-400 text-sm mt-2">{errors.college}</p>}

              {formData.college === "Other" && (
                <div className="mt-4">
                  <Input
                    placeholder="Enter your college/university name"
                    value={formData.customCollege}
                    onChange={(e) => {
                      const newFormData = { ...formData, customCollege: e.target.value };
                      setFormData(newFormData);
                      localStorage.setItem('samyukta_registration_form', JSON.stringify(newFormData));
                    }}
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                  {errors.customCollege && <p className="text-red-400 text-sm mt-2">{errors.customCollege}</p>}
                </div>
              )}
            </div>

            <div>
              <Label className="text-white text-lg mb-4 block">Team Size</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((size) => (
                  <Button
                    key={size}
                    type="button"
                    onClick={() => handleTeamSizeChange(size)}
                    variant={formData.teamSize === size ? "default" : "outline"}
                    className={`p-4 md:p-6 text-center font-medium ${formData.teamSize === size
                      ? 'bg-blue-500 border-blue-400 text-white'
                      : 'bg-gray-800/40 border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                  >
                    {size}
                  </Button>))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-white">Team Member Details</h3>
            {formData.members.map((member, index) => (
              <Card key={index} className="bg-gray-800/40 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Member {index + 1} {index === 0 && "(Team Lead)"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Full Name</Label>
                      <Input
                        value={member.fullName}
                        onChange={(e) => handleMemberChange(index, 'fullName', e.target.value)}
                        className="bg-gray-700/50 border-gray-600 text-white"
                        placeholder="Enter full name"
                      />
                      {errors[`member${index}Name`] && (
                        <p className="text-red-400 text-sm mt-1">{errors[`member${index}Name`]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Email</Label>
                      <Input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                        className="bg-gray-700/50 border-gray-600 text-white"
                        placeholder="email@example.com"
                      />
                      {errors[`member${index}Email`] && (
                        <p className="text-red-400 text-sm mt-1">{errors[`member${index}Email`]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">WhatsApp Number</Label>
                      <Input
                        value={member.whatsapp}
                        onChange={(e) => handleMemberChange(index, 'whatsapp', e.target.value)}
                        className="bg-gray-700/50 border-gray-600 text-white"
                        placeholder="10-digit number"
                        maxLength={10}
                      />
                      {errors[`member${index}Phone`] && (
                        <p className="text-red-400 text-sm mt-1">{errors[`member${index}Phone`]}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Year</Label>
                        <Select
                          value={member.year}
                          onValueChange={(value) => handleMemberChange(index, 'year', value)}
                        >
                          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors[`member${index}Year`] && (
                          <p className="text-red-400 text-sm mt-1">{errors[`member${index}Year`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-300">Department</Label>
                        <Select
                          value={member.department}
                          onValueChange={(value) => handleMemberChange(index, 'department', value)}
                        >
                          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                            <SelectValue placeholder="Dept" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors[`member${index}Department`] && (
                          <p className="text-red-400 text-sm mt-1">{errors[`member${index}Department`]}</p>
                        )}
                      </div>
                    </div>


                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-300">Food Preference</Label>
                    <RadioGroup
                      value={member.foodPreference}
                      onValueChange={(value) => handleMemberChange(index, 'foodPreference', value)}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="veg" id={`veg-${index}`} />
                        <Label htmlFor={`veg-${index}`} className="text-gray-300">Veg</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="non-veg" id={`non-veg-${index}`} />
                        <Label htmlFor={`non-veg-${index}`} className="text-gray-300">Non-Veg</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`accommodation-${index}`}
                        checked={member.accommodation}
                        onCheckedChange={(checked) => handleMemberChange(index, 'accommodation', checked)}
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                      <Label htmlFor={`accommodation-${index}`} className="text-gray-300">
                        Accommodation required
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`club-lead-${index}`}
                        checked={member.isClubLead || false}
                        onCheckedChange={(checked) => handleMemberChange(index, 'isClubLead', checked)}
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                      <Label htmlFor={`club-lead-${index}`} className="text-gray-300">
                        Are you a club lead?
                      </Label>
                    </div>

                    {member.isClubLead && (
                      <div className="ml-6 space-y-2">
                        <Label className="text-gray-300">Club Name</Label>
                        <Input
                          value={member.clubName || ""}
                          onChange={(e) => handleMemberChange(index, 'clubName', e.target.value)}
                          className="bg-gray-700/50 border-gray-600 text-white"
                          placeholder="Enter club name"
                        />
                        <div className="flex items-start space-x-2 text-sm text-blue-400">
                          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <p>Our team will contact you for verification and discuss plans for club leads.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-white">Choose Your Ticket Type</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <motion.div
                whileHover={{ y: -10 }}
                className="cursor-pointer"
                onClick={() => setFormData({ ...formData, tickets: { ...formData.tickets, combo: false } })}
              >
                <Card className={`bg-gray-800/40 border-gray-700 transition-all ${!formData.tickets.combo ? 'ring-2 ring-blue-500' : ''
                  }`}>
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Entry + Workshop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-2xl font-bold text-blue-400">₹800</div>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Workshop access</li>
                        <li>• Meals & refreshments</li>
                        <li>• Certificate</li>
                        <li>• Networking opportunities</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="cursor-pointer"
                onClick={() => setFormData({ ...formData, tickets: { ...formData.tickets, combo: true } })}
              >
                <Card className={`bg-gray-800/40 border-gray-700 transition-all ${formData.tickets.combo ? 'ring-2 ring-violet-500' : ''
                  }`}>
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Star className="w-5 h-5 mr-2" />
                      Combo Pass
                      <Badge className="ml-2 bg-violet-500/20 text-violet-300">Popular</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-2xl font-bold text-violet-400">₹900-₹950</div>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Everything in Entry + Workshop</li>
                        <li>• Competition access</li>
                        <li>• Team discounts</li>
                        <li>• Priority support</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>


          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-white">Member Track Selection</h3>
            <p className="text-gray-300">Select workshop and competition tracks for each team member</p>

            {formData.members.map((member, index) => {
              const memberTrack = formData.memberTracks[index] || { workshopTrack: "", competitionTrack: "" };
              return (
                <Card key={index} className="bg-gray-800/40 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {member.fullName || `Member ${index + 1}`} {index === 0 && "(Team Lead)"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Workshop Track</Label>
                      <Select
                        value={memberTrack.workshopTrack}
                        onValueChange={(value) => {
                          const newTracks = [...formData.memberTracks];
                          newTracks[index] = { ...memberTrack, workshopTrack: value };
                          setFormData({ ...formData, memberTracks: newTracks });
                        }}
                      >
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue placeholder="Select workshop track" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cloud Computing (AWS)" disabled={!stats || stats.cloud_closed}>
                            <div className="flex items-center justify-between w-full">
                              <span>Cloud Computing (AWS)</span>
                              {stats && (
                                <Badge className={`ml-2 text-xs ${stats.cloud_closed ? 'bg-red-500/10 text-red-400' : stats.remaining_cloud <= 10 ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                  {stats.cloud_closed ? 'CLOSED' : `${stats.remaining_cloud} left`}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                          <SelectItem value="AI/ML (Google)" disabled={!stats || stats.ai_closed}>
                            <div className="flex items-center justify-between w-full">
                              <span>AI/ML (Google)</span>
                              {stats && (
                                <Badge className={`ml-2 text-xs ${stats.ai_closed ? 'bg-red-500/10 text-red-400' : stats.remaining_ai <= 10 ? 'bg-orange-500/10 text-orange-400' : 'bg-violet-500/10 text-violet-400'}`}>
                                  {stats.ai_closed ? 'CLOSED' : `${stats.remaining_ai} left`}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors[`member${index}Workshop`] && (
                        <p className="text-red-400 text-sm mt-1">{errors[`member${index}Workshop`]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Competition Track</Label>
                      <Select
                        value={memberTrack.competitionTrack}
                        onValueChange={(value) => {
                          const newTracks = [...formData.memberTracks];
                          newTracks[index] = { ...memberTrack, competitionTrack: value };
                          setFormData({ ...formData, memberTracks: newTracks });
                        }}
                        disabled={!formData.tickets.combo}
                      >
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue placeholder={formData.tickets.combo ? "Select competition track" : "Available with Combo Pass only"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hackathon" disabled={!stats || stats.hackathon_closed}>
                            <div className="flex items-center justify-between w-full">
                              <span>Hackathon</span>
                              {stats && (
                                <Badge className={`ml-2 text-xs ${stats.hackathon_closed ? 'bg-red-500/10 text-red-400' : (stats.remaining_hackathon || 0) <= 10 ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}`}>
                                  {stats.hackathon_closed ? 'CLOSED' : `${stats.remaining_hackathon || 0} left`}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                          <SelectItem value="Startup Pitch" disabled={!stats || stats.pitch_closed}>
                            <div className="flex items-center justify-between w-full">
                              <span>Startup Pitch</span>
                              {stats && (
                                <Badge className={`ml-2 text-xs ${stats.pitch_closed ? 'bg-red-500/10 text-red-400' : (stats.remaining_pitch || 0) <= 10 ? 'bg-orange-500/10 text-orange-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                  {stats.pitch_closed ? 'CLOSED' : `${stats.remaining_pitch || 0} left`}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors[`member${index}Competition`] && (
                        <p className="text-red-400 text-sm mt-1">{errors[`member${index}Competition`]}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <div className="bg-gray-800/40 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-bold text-white mb-4">Price Summary</h4>
              <div className="space-y-2">
                {calculatePrice().breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between text-gray-300">
                    <span>{item.item}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
                <div className="flex justify-between text-gray-300">
                  <span>Team Size</span>
                  <span>x{formData.teamSize}</span>
                </div>
                {calculatePrice().teamDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Team Discount</span>
                    <span>-₹{calculatePrice().teamDiscount}</span>
                  </div>
                )}
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span>₹{calculatePrice().totalForTeam}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-white">Payment Information</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/40 rounded-lg p-4 md:p-6 border border-gray-700">
                <h4 className="text-lg font-bold text-white mb-4">Payment Details</h4>
                <div className="space-y-4">
                  <div className="text-xl md:text-2xl font-bold text-green-400">
                    Total Amount: ₹{calculatePrice().totalForTeam}
                  </div>
                  <div className="text-gray-300">
                    <p className="mb-2">Pay via UPI/Bank Transfer to:</p>
                    <div className="bg-gray-700/50 p-3 md:p-4 rounded-lg text-sm md:text-base">
                      <p className="break-all"><strong>UPI ID:</strong> samyukta2025@paytm</p>
                      <p><strong>Bank Name:</strong> State Bank of India</p>
                      <p><strong>Account No:</strong> 1234567890</p>
                      <p><strong>IFSC:</strong> SBIN0001234</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/40 rounded-lg p-4 md:p-6 border border-gray-700 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="w-32 h-32 bg-gray-700/50 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-xs">QR Code</span>
                  </div>
                  <p className="text-sm">Scan to Pay</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Transaction ID</Label>
                <Input
                  value={formData.payment.transactionId}
                  onChange={(e) => {
                  const newFormData = { ...formData, payment: { ...formData.payment, transactionId: e.target.value } };
                  setFormData(newFormData);
                  localStorage.setItem('samyukta_registration_form', JSON.stringify(newFormData));
                }}
                  className="bg-gray-700/50 border-gray-600 text-white"
                  placeholder="Enter transaction ID"
                />
                {errors.transactionId && <p className="text-red-400 text-sm mt-1">{errors.transactionId}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Payment Screenshot</Label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {formData.payment.screenshot ? (
                      <div className="flex flex-col items-center">
                        <Image
                          src={URL.createObjectURL(formData.payment.screenshot)}
                          alt="Payment Screenshot"
                          width={128}
                          height={128}
                          className="h-32 w-auto object-contain mb-2"
                          style={{ width: 'auto', height: '128px' }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData({ ...formData, payment: { ...formData.payment, screenshot: null } })}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-400">
                          <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300">
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const newFormData = {
                                    ...formData,
                                    payment: {
                                      ...formData.payment,
                                      screenshot: e.target.files[0]
                                    }
                                  };
                                  setFormData(newFormData);
                                  // Don't save file object to localStorage
                                  const dataToSave = { ...newFormData, payment: { ...newFormData.payment, screenshot: null } };
                                  localStorage.setItem('samyukta_registration_form', JSON.stringify(dataToSave));
                                }
                              }}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
                {errors.paymentScreenshot && <p className="text-red-400 text-sm mt-1">{errors.paymentScreenshot}</p>}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Registration Complete!</h3>
            <p className="text-gray-300">
              Thank you for registering for Samyukta 2025. You will receive a confirmation email shortly.
            </p>

            {completedRegistration && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800/40 rounded-lg p-6 border border-gray-700 text-left">
                  <h4 className="text-lg font-bold text-white mb-4">Registration Details</h4>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>College:</strong> {completedRegistration.college}</p>
                    <p><strong>Ticket Type:</strong> {completedRegistration.ticket_type}</p>
                    <p><strong>Total Amount:</strong> ₹{completedRegistration.total_amount}</p>
                    <p><strong>Transaction ID:</strong> {completedRegistration.transaction_id}</p>
                  </div>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-6 border border-blue-500/20">
                  <h4 className="text-lg font-bold text-blue-400 mb-4">Next Steps</h4>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p className="text-left">Your payment will be verified within 24 hours</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p className="text-left">QR codes will be generated after payment confirmation</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p className="text-left">Access your dashboard to view QR codes and participate in games</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p className="text-left">Check your email for confirmation and updates</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-blue-500 to-violet-500 mt-6"
            >
              Go to Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto">
      <div className="container-narrow section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8 lg:mb-12"
        >
          <div className="text-spacing-lg">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              Register for <span className="text-blue-400">Samyukta 2025</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300">
              Join the ultimate tech summit and elevate your skills
            </p>
            {stats && (
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {stats.event_closed ? (
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30 px-4 py-2">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    EVENT CLOSED - Registration Full
                  </Badge>
                ) : (
                  <>
                    <Badge className={`px-3 py-1 ${
                      stats.remaining_total <= 10 
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : stats.remaining_total <= 50
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      <Clock className="w-3 h-3 mr-1" />
                      {stats.remaining_total} slots remaining
                    </Badge>
                    {(stats.cloud_closed || stats.ai_closed) && (
                      <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 px-3 py-1">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Some tracks closed
                      </Badge>
                    )}
                    {(stats.hackathon_closed || stats.pitch_closed) && (
                      <Badge className="bg-red-500/10 text-red-400 border-red-500/20 px-3 py-1">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Competitions filling up
                      </Badge>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          {/* Desktop Progress Steps */}
          <div className="hidden md:flex items-center justify-between mb-6 lg:mb-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index !== steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= step.id
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-600 text-gray-400'
                    }`}
                >
                  <step.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 lg:mx-4 ${currentStep > step.id ? 'bg-blue-500' : 'bg-gray-600'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Mobile Progress Steps */}
          <div className="md:hidden mb-4 sm:mb-6">
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-3 sm:mb-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${currentStep >= step.id ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                />
              ))}
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-400">
                Step {currentStep} of {steps.length}
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-spacing">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-sm sm:text-base text-gray-400 hidden md:block">
                Step {currentStep} of {steps.length}
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800/40 backdrop-blur-sm rounded-2xl component-padding border border-gray-700 mb-4 sm:mb-6 lg:mb-8 max-w-none overflow-hidden"
        >
          <div className="pr-2 sm:pr-3">
            {renderStepContent()}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
            className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white w-full sm:w-auto order-2 sm:order-1 py-2 sm:py-3 text-sm sm:text-base"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Previous
          </Button>

          {currentStep === 6 ? (
            <div className="w-full sm:w-auto order-1 sm:order-2">
              {/* Navigation buttons are hidden on success page */}
            </div>
          ) : currentStep === 5 ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-violet-500 w-full sm:w-auto order-1 sm:order-2 py-2 sm:py-3 text-sm sm:text-base flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Submit Registration
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-500 to-violet-500 w-full sm:w-auto order-1 sm:order-2 py-2 sm:py-3 text-sm sm:text-base"
            >
              Next
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
            </Button>
          )}
        </div>

        {errors.submit && currentStep !== 6 && (
          <div className="mt-4 text-center text-red-400">
            {errors.submit}
          </div>
        )}
      </div>
    </div>
  );
}