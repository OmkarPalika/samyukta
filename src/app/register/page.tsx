'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Users, Star, ArrowRight, ChevronLeft, User as UserIcon, CreditCard, FileText, Copy, Upload, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { uploadFile, validateFile } from "@/lib/file-upload";
import StartupPitchDialog from '@/components/StartupPitchDialog';
import PitchModeDialog from "@/components/PitchModeDialog";

type Role = 'Student' | 'Working Professional' | 'Academician' | 'Entrepreneur' | 'Researcher' | 'Other';
type Organization = 'College/University' | 'Company' | 'Startup' | 'Freelancer' | 'Other';

interface TeamMember {
  fullName: string;
  email: string;
  whatsapp: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  role: Role;
  customRole?: string;
  organization: Organization;
  customOrganization?: string;
  college?: string;
  degree?: 'Bachelors' | 'Masters' | 'Associate' | 'Doctoral' | 'Other';
  customDegree?: string;
  year?: string;
  stream?: string;
  accommodation: boolean;
  foodPreference: 'veg' | 'non-veg';
  isClubMember: boolean;
  clubName?: string;
  clubDesignation?: string;
  sameAsLead?: boolean;
}

interface StartupPitchData {
  startupName: string;
  pitchCategory: string;
  briefDescription: string;
  problemStatement: string;
  targetMarket: string;
  currentStage: string;
  teamSize: string;
  fundingStatus: string;
  pitchDeck: File | null;
  demoUrl: string;
}

interface FormData {
  teamSize: number;
  members: TeamMember[];
  tickets: {
    combo: boolean;
    workshop: string;
    competition: string;
  };
  memberTracks: Array<{
    workshopTrack: string;
    competitionTrack: string;
  }>;
  startupPitchData: Record<number, StartupPitchData>;
  payment: {
    transactionId: string;
    screenshot: File | null;
  };
}

export default function Register() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploadingPayment, setUploadingPayment] = useState(false);
  const [completedRegistration, setCompletedRegistration] = useState<{ team_id: string } | null>(null);
  const [showPitchDialog, setShowPitchDialog] = useState(false);
  const [showPitchModeDialog, setShowPitchModeDialog] = useState(false);
  const [currentPitchMember, setCurrentPitchMember] = useState(0);

  const [formData, setFormData] = useState<FormData>({
    teamSize: 1,
    members: [{
      fullName: "",
      email: "",
      whatsapp: "",
      gender: "",
      role: "Student",
      customRole: "",
      organization: "College/University",
      customOrganization: "",
      college: "ANITS",
      degree: "Bachelors",
      customDegree: "",
      year: "",
      stream: "",
      accommodation: false,
      foodPreference: "veg",
      isClubMember: false,
      clubName: "",
      clubDesignation: "",
      sameAsLead: false
    }],
    tickets: { combo: false, workshop: "", competition: "" },
    memberTracks: [],
    startupPitchData: {},
    payment: { transactionId: "", screenshot: null }
  });

  const steps = [
    { id: 1, title: "Team Lead Details", icon: UserIcon },
    { id: 2, title: "Team Size & Tickets", icon: Users },
    { id: 3, title: "Team Members", icon: Users },
    { id: 4, title: "Tracks & Pricing", icon: Star },
    { id: 5, title: "Payment", icon: CreditCard },
    { id: 6, title: "Confirmation", icon: Check }
  ];

  const roles: Role[] = ['Student', 'Working Professional', 'Academician', 'Entrepreneur', 'Researcher', 'Other'];
  const organizations: Organization[] = ['College/University', 'Company', 'Startup', 'Freelancer', 'Other'];
  const years = ["1st", "2nd", "3rd", "4th", "5th"];
  const degrees = ["Bachelors", "Masters", "Associate", "Doctoral", "Other"];

  const handleMemberChange = (index: number, field: string, value: string | boolean) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData({ ...formData, members: newMembers });
  };

  const copyFromTeamLead = (index: number) => {
    if (index === 0) return;
    const teamLead = formData.members[0];
    const newMembers = [...formData.members];
    newMembers[index] = {
      ...newMembers[index],
      role: teamLead.role,
      customRole: teamLead.customRole,
      organization: teamLead.organization,
      customOrganization: teamLead.customOrganization,
      college: teamLead.college,
      degree: teamLead.degree,
      customDegree: teamLead.customDegree,
      year: teamLead.year,
      stream: teamLead.stream,
      foodPreference: teamLead.foodPreference,
      accommodation: teamLead.accommodation,
      sameAsLead: true
    };
    setFormData({ ...formData, members: newMembers });
  };

  const handleTeamSizeChange = (size: number) => {
    const newMembers = [...formData.members];
    if (size > formData.teamSize) {
      for (let i = formData.teamSize; i < size; i++) {
        newMembers.push({
          fullName: "",
          email: "",
          whatsapp: "",
          gender: "",
          role: "Student",
          customRole: "",
          organization: "College/University",
          customOrganization: "",
          college: "ANITS",
          degree: "Bachelors",
          customDegree: "",
          year: "",
          stream: "",
          accommodation: false,
          foodPreference: "veg",
          isClubMember: false,
          clubName: "",
          clubDesignation: "",
          sameAsLead: false
        });
      }
    } else if (size < formData.teamSize) {
      newMembers.splice(size);
    }
    setFormData({ ...formData, teamSize: size, members: newMembers });
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        const teamLead = formData.members[0];
        if (!teamLead.fullName) newErrors.teamLeadName = "Name required";
        if (!teamLead.email) newErrors.teamLeadEmail = "Email required";
        if (!teamLead.whatsapp) newErrors.teamLeadPhone = "Phone required";
        if (!teamLead.gender) newErrors.teamLeadGender = "Gender required";
        if (!teamLead.role) newErrors.teamLeadRole = "Role required";
        if (teamLead.role === "Other" && !teamLead.customRole) newErrors.teamLeadCustomRole = "Please specify role";
        if (!teamLead.organization) newErrors.teamLeadOrg = "Organization required";
        if (teamLead.organization === "College/University" && !teamLead.college) newErrors.teamLeadCollege = "College required";
        if (teamLead.organization !== "College/University" && !teamLead.customOrganization) newErrors.teamLeadCustomOrg = "Organization name required";
        if (teamLead.role === "Student" && !teamLead.degree) newErrors.teamLeadDegree = "Degree required";
        if (teamLead.role === "Student" && teamLead.degree === "Other" && !teamLead.customDegree) newErrors.teamLeadCustomDegree = "Please specify degree";
        if (teamLead.role === "Student" && !teamLead.year) newErrors.teamLeadYear = "Year required";
        if (teamLead.role === "Student" && !teamLead.stream) newErrors.teamLeadStream = "Stream required";
        break;
      case 3:
        if (formData.teamSize > 1) {
          formData.members.slice(1).forEach((member, index) => {
            const memberIndex = index + 1;
            if (!member.fullName) newErrors[`member${memberIndex}Name`] = "Name required";
            if (!member.email) newErrors[`member${memberIndex}Email`] = "Email required";
            if (!member.whatsapp) newErrors[`member${memberIndex}Phone`] = "Phone required";
            if (!member.gender) newErrors[`member${memberIndex}Gender`] = "Gender required";
            if (!member.sameAsLead) {
              if (!member.role) newErrors[`member${memberIndex}Role`] = "Role required";
              if (member.role === "Other" && !member.customRole) newErrors[`member${memberIndex}CustomRole`] = "Please specify role";
              if (!member.organization) newErrors[`member${memberIndex}Org`] = "Organization required";
              if (member.organization === "College/University" && !member.college) newErrors[`member${memberIndex}College`] = "College required";
              if (member.organization !== "College/University" && !member.customOrganization) newErrors[`member${memberIndex}CustomOrg`] = "Organization name required";
              if (member.role === "Student" && !member.degree) newErrors[`member${memberIndex}Degree`] = "Degree required";
              if (member.role === "Student" && member.degree === "Other" && !member.customDegree) newErrors[`member${memberIndex}CustomDegree`] = "Please specify degree";
              if (member.role === "Student" && !member.year) newErrors[`member${memberIndex}Year`] = "Year required";
              if (member.role === "Student" && !member.stream) newErrors[`member${memberIndex}Stream`] = "Stream required";
            }
          });
        }
        break;
      case 4:
        formData.members.forEach((member, index) => {
          const memberTrack = formData.memberTracks[index];
          if (!memberTrack?.workshopTrack) {
            newErrors[`member${index}Workshop`] = "Workshop track required";
          }
          if (formData.tickets.combo && !memberTrack?.competitionTrack) {
            newErrors[`member${index}Competition`] = "Competition track required for combo pass";
          }
          if (memberTrack?.competitionTrack === "Startup Pitch" && !formData.startupPitchData[index]) {
            newErrors[`member${index}PitchDetails`] = "Startup pitch details required";
          }
        });
        break;
      case 5:
        if (!formData.payment.transactionId) newErrors.transactionId = "Transaction ID required";
        if (!formData.payment.screenshot) newErrors.paymentScreenshot = "Payment screenshot required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep === 5) {
      await handleSubmit();
    } else if (validateStep(currentStep)) {
      let nextStep = currentStep + 1;
      if (currentStep === 2 && formData.teamSize === 1) {
        nextStep = 4;
      }
      setCurrentStep(Math.min(nextStep, 6));
    }
  };

  const handlePrevious = () => {
    let prevStep = currentStep - 1;
    if (currentStep === 4 && formData.teamSize === 1) {
      prevStep = 2;
    }
    setCurrentStep(Math.max(prevStep, 1));
  };

  const calculatePrice = () => {
    let total = 0;
    if (formData.tickets.combo) {
      total = 900 * formData.teamSize;
      if (formData.teamSize > 1) total -= formData.teamSize * 10;
    } else {
      total = 800 * formData.teamSize;
      formData.memberTracks.forEach(track => {
        if (track.competitionTrack === "Hackathon") total += 150;
        else if (track.competitionTrack === "Startup Pitch") total += 100;
      });
    }
    return total;
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    setLoading(true);
    try {
      let paymentScreenshotUrl = "";
      if (formData.payment.screenshot) {
        setUploadingPayment(true);
        validateFile(formData.payment.screenshot);
        const result = await uploadFile(formData.payment.screenshot, '/api/registrations/upload-payment');
        paymentScreenshotUrl = result.file_url;
        setUploadingPayment(false);
      }
      const membersData = formData.members.map((member, index) => ({
        participant_id: `PART${Date.now()}-${index + 1}`,
        passkey: Math.random().toString(36).substring(2, 8).toUpperCase(),
        full_name: member.fullName,
        email: member.email,
        whatsapp: member.whatsapp,
        year: member.year || "N/A",
        department: member.stream || "N/A",
        accommodation: member.accommodation,
        food_preference: member.foodPreference,
        workshop_track: formData.memberTracks[index]?.workshopTrack || "",
        competition_track: formData.memberTracks[index]?.competitionTrack || "",
        is_club_lead: member.isClubMember || false,
        club_name: member.clubName || ""
      }));
      const registrationData = {
        college: formData.members[0].organization === "College/University"
          ? (formData.members[0].college === "Other" ? formData.members[0].customOrganization : formData.members[0].college)
          : formData.members[0].customOrganization,
        members: membersData,
        ticket_type: formData.tickets.combo ? "Combo" : "Custom",
        workshop_track: formData.memberTracks[0]?.workshopTrack?.includes("Cloud") ? "Cloud" : "AI",
        competition_track: formData.memberTracks[0]?.competitionTrack === "Hackathon" ? "Hackathon" :
          formData.memberTracks[0]?.competitionTrack === "Startup Pitch" ? "Pitch" : "None",
        total_amount: calculatePrice(),
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
        setErrors({ submit: errorData.error || 'Registration failed' });
        setLoading(false);
        return;
      }
      const result = await response.json();
      setCompletedRegistration({ ...registrationData, team_id: result.team_id });
      setCurrentStep(6);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: "Registration failed. Please try again." });
    }
    setLoading(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        const teamLead = formData.members[0];
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Team Lead Information</h3>
              <p className="text-gray-300">Let&apos;s start with the primary contact person</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Full Name<span className="text-red-500"> *</span></Label>
                <Input
                  value={teamLead.fullName}
                  onChange={(e) => handleMemberChange(0, 'fullName', e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white"
                  placeholder="Enter full name"
                />
                {errors.teamLeadName && <p className="text-red-400 text-sm">{errors.teamLeadName}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Email<span className="text-red-500"> *</span></Label>
                <Input
                  type="email"
                  value={teamLead.email}
                  onChange={(e) => handleMemberChange(0, 'email', e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white"
                  placeholder="email@example.com"
                />
                {errors.teamLeadEmail && <p className="text-red-400 text-sm">{errors.teamLeadEmail}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">WhatsApp Number<span className="text-red-500"> *</span></Label>
                <Input
                  value={teamLead.whatsapp}
                  onChange={(e) => handleMemberChange(0, 'whatsapp', e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white"
                  placeholder="10-digit number"
                  maxLength={10}
                />
                {errors.teamLeadPhone && <p className="text-red-400 text-sm">{errors.teamLeadPhone}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Gender<span className="text-red-500"> *</span></Label>
                <Select
                  value={teamLead.gender}
                  onValueChange={(value: 'Male' | 'Female' | 'Other') => handleMemberChange(0, 'gender', value)}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.teamLeadGender && <p className="text-red-400 text-sm">{errors.teamLeadGender}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Role<span className="text-red-500"> *</span></Label>
                <Select
                  value={teamLead.role}
                  onValueChange={(value: Role) => handleMemberChange(0, 'role', value)}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.teamLeadRole && <p className="text-red-400 text-sm">{errors.teamLeadRole}</p>}
              </div>

              {teamLead.role === "Other" && (
                <div className="space-y-2">
                  <Label className="text-gray-300">Specify Role<span className="text-red-500"> *</span></Label>
                  <Input
                    value={teamLead.customRole || ""}
                    onChange={(e) => handleMemberChange(0, 'customRole', e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white"
                    placeholder="Enter your role"
                  />
                  {errors.teamLeadCustomRole && <p className="text-red-400 text-sm">{errors.teamLeadCustomRole}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-gray-300">Organization Type<span className="text-red-500"> *</span></Label>
                <Select
                  value={teamLead.organization}
                  onValueChange={(value: Organization) => handleMemberChange(0, 'organization', value)}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org} value={org}>{org}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.teamLeadOrg && <p className="text-red-400 text-sm">{errors.teamLeadOrg}</p>}
              </div>

              {teamLead.organization === "College/University" ? (
                <div className="space-y-2">
                  <Label className="text-gray-300">College<span className="text-red-500"> *</span></Label>
                  <RadioGroup
                    value={teamLead.college || ""}
                    onValueChange={(value) => handleMemberChange(0, 'college', value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ANITS" id="anits-lead" />
                      <Label htmlFor="anits-lead" className="text-gray-300">ANITS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Other" id="other-college-lead" />
                      <Label htmlFor="other-college-lead" className="text-gray-300">Other</Label>
                    </div>
                  </RadioGroup>
                  {teamLead.college === "Other" && (
                    <Input
                      value={teamLead.customOrganization || ""}
                      onChange={(e) => handleMemberChange(0, 'customOrganization', e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white mt-2"
                      placeholder="Enter college name"
                    />
                  )}
                  {errors.teamLeadCollege && <p className="text-red-400 text-sm">{errors.teamLeadCollege}</p>}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-gray-300">Organization Name<span className="text-red-500"> *</span></Label>
                  <Input
                    value={teamLead.customOrganization || ""}
                    onChange={(e) => handleMemberChange(0, 'customOrganization', e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white"
                    placeholder="Enter organization name"
                  />
                  {errors.teamLeadCustomOrg && <p className="text-red-400 text-sm">{errors.teamLeadCustomOrg}</p>}
                </div>
              )}

              {teamLead.role === "Student" && (
                <>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-gray-300">Degree<span className="text-red-500"> *</span></Label>
                    <RadioGroup
                      value={teamLead.degree || ""}
                      onValueChange={(value) => handleMemberChange(0, 'degree', value)}
                      className="flex flex-wrap gap-4"
                    >
                      {degrees.map((degree) => (
                        <div key={degree} className="flex items-center space-x-2">
                          <RadioGroupItem value={degree} id={`degree-${degree}-lead`} />
                          <Label htmlFor={`degree-${degree}-lead`} className="text-gray-300">{degree}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {teamLead.degree === "Other" && (
                      <Input
                        value={teamLead.customDegree || ""}
                        onChange={(e) => handleMemberChange(0, 'customDegree', e.target.value)}
                        className="bg-gray-700/50 border-gray-600 text-white mt-2"
                        placeholder="Specify degree"
                      />
                    )}
                    {errors.teamLeadDegree && <p className="text-red-400 text-sm">{errors.teamLeadDegree}</p>}
                    {errors.teamLeadCustomDegree && <p className="text-red-400 text-sm">{errors.teamLeadCustomDegree}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Year<span className="text-red-500"> *</span></Label>
                    <Select
                      value={teamLead.year || ""}
                      onValueChange={(value) => handleMemberChange(0, 'year', value)}
                    >
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.teamLeadYear && <p className="text-red-400 text-sm">{errors.teamLeadYear}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Stream<span className="text-red-500"> *</span></Label>
                    <Input
                      value={teamLead.stream || ""}
                      onChange={(e) => handleMemberChange(0, 'stream', e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white"
                      placeholder="e.g., Computer Science"
                    />
                    {errors.teamLeadStream && <p className="text-red-400 text-sm">{errors.teamLeadStream}</p>}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4 mt-6">
              <div className="space-y-3">
                <Label className="text-gray-300">Food Preference</Label>
                <RadioGroup
                  value={teamLead.foodPreference}
                  onValueChange={(value) => handleMemberChange(0, 'foodPreference', value)}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="veg" id="lead-veg" />
                    <Label htmlFor="lead-veg" className="text-gray-300">Veg</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non-veg" id="lead-non-veg" />
                    <Label htmlFor="lead-non-veg" className="text-gray-300">Non-Veg</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lead-accommodation"
                  checked={teamLead.accommodation}
                  onCheckedChange={(checked) => handleMemberChange(0, 'accommodation', checked)}
                />
                <Label htmlFor="lead-accommodation" className="text-gray-300">
                  Accommodation required
                  <Badge className={`ml-2 text-xs ${teamLead.gender === 'Female' ? 'bg-pink-500/10 text-pink-400' : teamLead.gender === 'Male' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
                    {teamLead.gender === 'Female' ? 'Female: 50 slots left' : teamLead.gender === 'Male' ? 'Male: 50 slots left' : '50M/50F slots left'}
                  </Badge>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lead-club"
                  checked={teamLead.isClubMember}
                  onCheckedChange={(checked) => handleMemberChange(0, 'isClubMember', checked)}
                />
                <Label htmlFor="lead-club" className="text-gray-300">
                  Are you part of a core team of a club at your college?
                </Label>
              </div>

              {teamLead.isClubMember && (
                <div className="ml-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Club Name</Label>
                    <Input
                      value={teamLead.clubName || ""}
                      onChange={(e) => handleMemberChange(0, 'clubName', e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white"
                      placeholder="Enter club name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Designation</Label>
                    <Input
                      value={teamLead.clubDesignation || ""}
                      onChange={(e) => handleMemberChange(0, 'clubDesignation', e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white"
                      placeholder="e.g., President, Secretary, Coordinator"
                    />
                    <div className="flex items-center space-x-2 text-sm text-blue-400 mt-2">
                      <InfoIcon className="w-4 h-4" />
                      <span>Our team will contact you for verification and discuss further plans with you</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Team Size & Ticket Selection</h3>
              <p className="text-gray-300">Choose your team size and ticket type</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Card className={`bg-gray-800/40 border-gray-700 cursor-pointer transition-all ${!formData.tickets.combo ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setFormData({ ...formData, tickets: { ...formData.tickets, combo: false } })}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Entry + Workshop
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">₹800</div>
                  <ul className="space-y-2 text-gray-300 mt-4">
                    <li>• Workshop access</li>
                    <li>• Meals & refreshments</li>
                    <li>• Certificate</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className={`bg-gray-800/40 border-gray-700 cursor-pointer transition-all ${formData.tickets.combo ? 'ring-2 ring-violet-500' : ''}`}
                onClick={() => setFormData({ ...formData, tickets: { ...formData.tickets, combo: true } })}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Combo Pass
                    <Badge className="ml-2 bg-violet-500/20 text-violet-300">Popular</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-violet-400">₹900-₹950</div>
                  <ul className="space-y-2 text-gray-300 mt-4">
                    <li>• Everything in Entry + Workshop</li>
                    <li>• Competition access</li>
                    <li>• Team discounts</li>
                    <li>• Perfect for professionals</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 3:
        if (formData.teamSize === 1) {
          return (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                <UserIcon className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Solo Registration</h3>
              <p className="text-gray-300">You&apos;re registering as an individual participant. Ready to proceed!</p>
            </div>
          );
        }

        return (
          <div className="space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Team Members</h3>
              <p className="text-gray-300">Add details for your remaining team members</p>
            </div>

            {formData.members.slice(1).map((member, index) => {
              const memberIndex = index + 1;
              return (
                <Card key={memberIndex} className="bg-gray-800/40 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>Member {memberIndex + 1}</span>
                      {!member.sameAsLead && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => copyFromTeamLead(memberIndex)}
                          className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Same as Team Lead
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {member.sameAsLead && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 font-medium">Using Team Lead details</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMemberChange(memberIndex, 'sameAsLead', false)}
                            className="text-gray-400 hover:text-white"
                          >
                            Edit Separately
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Full Name<span className="text-red-500"> *</span></Label>
                        <Input
                          value={member.fullName}
                          onChange={(e) => handleMemberChange(memberIndex, 'fullName', e.target.value)}
                          className="bg-gray-700/50 border-gray-600 text-white"
                          placeholder="Enter full name"
                        />
                        {errors[`member${memberIndex}Name`] && (
                          <p className="text-red-400 text-sm">{errors[`member${memberIndex}Name`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-300">Email<span className="text-red-500"> *</span></Label>
                        <Input
                          type="email"
                          value={member.email}
                          onChange={(e) => handleMemberChange(memberIndex, 'email', e.target.value)}
                          className="bg-gray-700/50 border-gray-600 text-white"
                          placeholder="email@example.com"
                        />
                        {errors[`member${memberIndex}Email`] && (
                          <p className="text-red-400 text-sm">{errors[`member${memberIndex}Email`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-300">WhatsApp Number<span className="text-red-500"> *</span></Label>
                        <Input
                          value={member.whatsapp}
                          onChange={(e) => handleMemberChange(memberIndex, 'whatsapp', e.target.value)}
                          className="bg-gray-700/50 border-gray-600 text-white"
                          placeholder="10-digit number"
                          maxLength={10}
                        />
                        {errors[`member${memberIndex}Phone`] && (
                          <p className="text-red-400 text-sm">{errors[`member${memberIndex}Phone`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-300">Gender<span className="text-red-500"> *</span></Label>
                        <Select
                          value={member.gender}
                          onValueChange={(value: 'Male' | 'Female' | 'Other') => handleMemberChange(memberIndex, 'gender', value)}
                        >
                          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors[`member${memberIndex}Gender`] && (
                          <p className="text-red-400 text-sm">{errors[`member${memberIndex}Gender`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-300">Role<span className="text-red-500"> *</span></Label>
                        <Select
                          value={member.role}
                          onValueChange={(value: Role) => handleMemberChange(memberIndex, 'role', value)}
                          disabled={member.sameAsLead}
                        >
                          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors[`member${memberIndex}Role`] && (
                          <p className="text-red-400 text-sm">{errors[`member${memberIndex}Role`]}</p>
                        )}
                      </div>

                      {member.role === "Other" && (
                        <div className="space-y-2">
                          <Label className="text-gray-300">Specify Role<span className="text-red-500"> *</span></Label>
                          <Input
                            value={member.customRole || ""}
                            onChange={(e) => handleMemberChange(memberIndex, 'customRole', e.target.value)}
                            className="bg-gray-700/50 border-gray-600 text-white"
                            placeholder="Enter your role"
                            disabled={member.sameAsLead}
                          />
                          {errors[`member${memberIndex}CustomRole`] && (
                            <p className="text-red-400 text-sm">{errors[`member${memberIndex}CustomRole`]}</p>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="text-gray-300">Organization Type<span className="text-red-500"> *</span></Label>
                        <Select
                          value={member.organization}
                          onValueChange={(value: Organization) => handleMemberChange(memberIndex, 'organization', value)}
                          disabled={member.sameAsLead}
                        >
                          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                            <SelectValue placeholder="Select organization type" />
                          </SelectTrigger>
                          <SelectContent>
                            {organizations.map((org) => (
                              <SelectItem key={org} value={org}>{org}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors[`member${memberIndex}Org`] && (
                          <p className="text-red-400 text-sm">{errors[`member${memberIndex}Org`]}</p>
                        )}
                      </div>

                      {member.organization === "College/University" ? (
                        <div className="space-y-2">
                          <Label className="text-gray-300">College<span className="text-red-500"> *</span></Label>
                          <RadioGroup
                            value={member.college || ""}
                            onValueChange={(value) => handleMemberChange(memberIndex, 'college', value)}
                            className="flex space-x-6"
                            disabled={member.sameAsLead}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="ANITS" id={`anits-${memberIndex}`} disabled={member.sameAsLead} />
                              <Label htmlFor={`anits-${memberIndex}`} className="text-gray-300">ANITS</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Other" id={`other-college-${memberIndex}`} disabled={member.sameAsLead} />
                              <Label htmlFor={`other-college-${memberIndex}`} className="text-gray-300">Other</Label>
                            </div>
                          </RadioGroup>
                          {member.college === "Other" && (
                            <Input
                              value={member.customOrganization || ""}
                              onChange={(e) => handleMemberChange(memberIndex, 'customOrganization', e.target.value)}
                              className="bg-gray-700/50 border-gray-600 text-white mt-2"
                              placeholder="Enter college name"
                              disabled={member.sameAsLead}
                            />
                          )}
                          {errors[`member${memberIndex}College`] && (
                            <p className="text-red-400 text-sm">{errors[`member${memberIndex}College`]}</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label className="text-gray-300">Organization Name<span className="text-red-500"> *</span></Label>
                          <Input
                            value={member.customOrganization || ""}
                            onChange={(e) => handleMemberChange(memberIndex, 'customOrganization', e.target.value)}
                            className="bg-gray-700/50 border-gray-600 text-white"
                            placeholder="Enter organization name"
                            disabled={member.sameAsLead}
                          />
                          {errors[`member${memberIndex}CustomOrg`] && (
                            <p className="text-red-400 text-sm">{errors[`member${memberIndex}CustomOrg`]}</p>
                          )}
                        </div>
                      )}

                      {member.role === "Student" && (
                        <>
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-gray-300">Degree<span className="text-red-500"> *</span></Label>
                            <RadioGroup
                              value={member.degree || ""}
                              onValueChange={(value) => handleMemberChange(memberIndex, 'degree', value)}
                              className="flex flex-wrap gap-4"
                              disabled={member.sameAsLead}
                            >
                              {degrees.map((degree) => (
                                <div key={degree} className="flex items-center space-x-2">
                                  <RadioGroupItem value={degree} id={`degree-${degree}-${memberIndex}`} disabled={member.sameAsLead} />
                                  <Label htmlFor={`degree-${degree}-${memberIndex}`} className="text-gray-300">{degree}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                            {member.degree === "Other" && (
                              <Input
                                value={member.customDegree || ""}
                                onChange={(e) => handleMemberChange(memberIndex, 'customDegree', e.target.value)}
                                className="bg-gray-700/50 border-gray-600 text-white mt-2"
                                placeholder="Specify degree"
                                disabled={member.sameAsLead}
                              />
                            )}
                            {errors[`member${memberIndex}Degree`] && (
                              <p className="text-red-400 text-sm">{errors[`member${memberIndex}Degree`]}</p>
                            )}
                            {errors[`member${memberIndex}CustomDegree`] && (
                              <p className="text-red-400 text-sm">{errors[`member${memberIndex}CustomDegree`]}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-300">Year<span className="text-red-500"> *</span></Label>
                            <Select
                              value={member.year || ""}
                              onValueChange={(value) => handleMemberChange(memberIndex, 'year', value)}
                              disabled={member.sameAsLead}
                            >
                              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                              <SelectContent>
                                {years.map((year) => (
                                  <SelectItem key={year} value={year}>{year}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors[`member${memberIndex}Year`] && (
                              <p className="text-red-400 text-sm">{errors[`member${memberIndex}Year`]}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-300">Stream<span className="text-red-500"> *</span></Label>
                            <Input
                              value={member.stream || ""}
                              onChange={(e) => handleMemberChange(memberIndex, 'stream', e.target.value)}
                              className="bg-gray-700/50 border-gray-600 text-white"
                              placeholder="e.g., Computer Science"
                              disabled={member.sameAsLead}
                            />
                            {errors[`member${memberIndex}Stream`] && (
                              <p className="text-red-400 text-sm">{errors[`member${memberIndex}Stream`]}</p>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-gray-300">Food Preference</Label>
                      <RadioGroup
                        value={member.foodPreference}
                        onValueChange={(value) => handleMemberChange(memberIndex, 'foodPreference', value)}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="veg" id={`veg-${memberIndex}`} disabled={member.sameAsLead} />
                          <Label htmlFor={`veg-${memberIndex}`} className="text-gray-300">Veg</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="non-veg" id={`non-veg-${memberIndex}`} disabled={member.sameAsLead} />
                          <Label htmlFor={`non-veg-${memberIndex}`} className="text-gray-300">Non-Veg</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`accommodation-${memberIndex}`}
                        checked={member.accommodation}
                        onCheckedChange={(checked) => handleMemberChange(memberIndex, 'accommodation', checked)}
                      />
                      <Label htmlFor={`accommodation-${memberIndex}`} className="text-gray-300">
                        Accommodation required
                        <Badge className={`ml-2 text-xs ${member.gender === 'Female' ? 'bg-pink-500/10 text-pink-400' : member.gender === 'Male' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
                          {member.gender === 'Female' ? 'Female: 50 slots left' : member.gender === 'Male' ? 'Male: 50 slots left' : '50M/50F slots left'}
                        </Badge>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`club-${memberIndex}`}
                        checked={member.isClubMember}
                        onCheckedChange={(checked) => handleMemberChange(memberIndex, 'isClubMember', checked)}
                      />
                      <Label htmlFor={`club-${memberIndex}`} className="text-gray-300">
                        Are you part of a core team of a club at your college?
                      </Label>
                    </div>

                    {member.isClubMember && (
                      <div className="ml-6 space-y-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Club Name</Label>
                          <Input
                            value={member.clubName || ""}
                            onChange={(e) => handleMemberChange(memberIndex, 'clubName', e.target.value)}
                            className="bg-gray-700/50 border-gray-600 text-white"
                            placeholder="Enter club name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Designation</Label>
                          <Input
                            value={member.clubDesignation || ""}
                            onChange={(e) => handleMemberChange(memberIndex, 'clubDesignation', e.target.value)}
                            className="bg-gray-700/50 border-gray-600 text-white"
                            placeholder="e.g., President, Secretary, Coordinator"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );

      case 4:
        return (
          <div className="space-y-8 overflow-x-hidden">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Tracks & Pricing</h3>
              <p className="text-gray-300">Select workshop and competition tracks for each team member</p>
            </div>

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
                      <Label className="text-gray-300">Workshop Track<span className="text-red-500"> *</span></Label>
                      <Select
                        value={memberTrack.workshopTrack}
                        onValueChange={(value) => {
                          const newTracks = [...formData.memberTracks];
                          while (newTracks.length <= index) {
                            newTracks.push({ workshopTrack: "", competitionTrack: "" });
                          }
                          newTracks[index] = { ...memberTrack, workshopTrack: value };
                          setFormData({ ...formData, memberTracks: newTracks });
                        }}
                      >
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue placeholder="Select workshop track" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cloud Computing (AWS)">
                            <div className="flex items-center justify-between w-full">
                              <span>Cloud Computing (AWS)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="AI/ML (Google)">
                            <div className="flex items-center justify-between w-full">
                              <span>AI/ML (Google)</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.tickets.combo ? (
                      <div className="space-y-2">
                        <Label className="text-gray-300">Competition Track<span className="text-red-500"> *</span></Label>
                        <Select
                          value={memberTrack.competitionTrack}
                          onValueChange={(value) => {
                            const newTracks = [...formData.memberTracks];
                            while (newTracks.length <= index) {
                              newTracks.push({ workshopTrack: "", competitionTrack: "" });
                            }
                            newTracks[index] = { ...memberTrack, competitionTrack: value };
                            setFormData({ ...formData, memberTracks: newTracks });

                            if (value === "Startup Pitch") {
                              setCurrentPitchMember(index);
                              setShowPitchModeDialog(true);
                            }
                          }}
                        >
                          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                            <SelectValue placeholder="Select competition track" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Hackathon">
                              <div className="flex items-center justify-between w-full">
                                <span>Hackathon</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Startup Pitch">
                              <div className="flex items-center justify-between w-full">
                                <span>Startup Pitch</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>

                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Label className="text-gray-300">Add-ons (Optional)</Label>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`hackathon-${index}`}
                              checked={memberTrack.competitionTrack === "Hackathon"}
                              onCheckedChange={(checked) => {
                                const newTracks = [...formData.memberTracks];
                                while (newTracks.length <= index) {
                                  newTracks.push({ workshopTrack: "", competitionTrack: "" });
                                }
                                newTracks[index] = { ...memberTrack, competitionTrack: checked ? "Hackathon" : "" };
                                setFormData({ ...formData, memberTracks: newTracks });
                              }}
                            />
                            <Label htmlFor={`hackathon-${index}`} className="text-gray-300">
                              Hackathon (+₹150)
                            </Label>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`pitch-${index}`}
                                checked={memberTrack.competitionTrack === "Startup Pitch"}
                                onCheckedChange={(checked) => {
                                  const newTracks = [...formData.memberTracks];
                                  while (newTracks.length <= index) {
                                    newTracks.push({ workshopTrack: "", competitionTrack: "" });
                                  }
                                  newTracks[index] = { ...memberTrack, competitionTrack: checked ? "Startup Pitch" : "" };
                                  const newFormData = { ...formData, memberTracks: newTracks };
                                  setFormData(newFormData);

                                  if (checked) {
                                    setCurrentPitchMember(index);
                                    setShowPitchModeDialog(true);
                                  }
                                }}
                              />
                              <Label htmlFor={`pitch-${index}`} className="text-gray-300">
                                Startup Pitch (+₹100)
                                <Badge className="ml-2 text-xs bg-purple-500/10 text-purple-400">35 left</Badge>
                              </Label>
                            </div>

                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            <div className="bg-gray-800/40 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-bold text-white mb-4">Price Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>{formData.tickets.combo ? 'Combo Pass' : 'Workshop Pass'}</span>
                  <span>₹{formData.tickets.combo ? 900 : 800}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Team Size</span>
                  <span>x{formData.teamSize}</span>
                </div>
                {!formData.tickets.combo && formData.memberTracks.map((track, index) => {
                  if (track.competitionTrack === "Hackathon") {
                    return (
                      <div key={`hackathon-${index}`} className="flex justify-between text-gray-300">
                        <span>Hackathon Add-on</span>
                        <span>+₹150</span>
                      </div>
                    );
                  } else if (track.competitionTrack === "Startup Pitch") {
                    return (
                      <div key={`pitch-${index}`} className="flex justify-between text-gray-300">
                        <span>Startup Pitch Add-on</span>
                        <span>+₹100</span>
                      </div>
                    );
                  }
                  return null;
                })}
                {formData.teamSize > 1 && formData.tickets.combo && (
                  <div className="flex justify-between text-green-400">
                    <span>Team Discount</span>
                    <span>-₹{formData.teamSize * 10}</span>
                  </div>
                )}
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span>₹{(() => {
                      let total = 0;
                      if (formData.tickets.combo) {
                        total = 900 * formData.teamSize;
                        if (formData.teamSize > 1) total -= formData.teamSize * 10;
                      } else {
                        total = 800 * formData.teamSize;
                        formData.memberTracks.forEach(track => {
                          if (track.competitionTrack === "Hackathon") total += 150;
                          else if (track.competitionTrack === "Startup Pitch") total += 100;
                        });
                      }
                      return total;
                    })()}</span>
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
                    Total Amount: ₹{calculatePrice()}
                  </div>
                  <div className="text-gray-300">
                    <p className="mb-2">Pay via UPI/Bank Transfer to:</p>
                    <div className="bg-gray-700/50 p-3 md:p-4 rounded-lg text-sm md:text-base">
                      <p className="break-all"><strong>UPI ID:</strong> 8897892720@ybl</p>
                      <p><strong>Name:</strong> Palika Umamaheswari</p>
                      <p><strong>Bank Name:</strong> State Bank of India</p>
                      <p><strong>Account No:</strong> 34473466684</p>
                      <p><strong>IFSC:</strong> SBIN0000942</p>
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
                <Label className="text-gray-300">Transaction ID<span className="text-red-500"> *</span></Label>
                <Input
                  value={formData.payment.transactionId}
                  onChange={(e) => setFormData({ ...formData, payment: { ...formData.payment, transactionId: e.target.value } })}
                  className="bg-gray-700/50 border-gray-600 text-white"
                  placeholder="Enter transaction ID"
                />
                {errors.transactionId && <p className="text-red-400 text-sm mt-1">{errors.transactionId}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Payment Screenshot<span className="text-red-500"> *</span></Label>
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
                                  setFormData({ ...formData, payment: { ...formData.payment, screenshot: e.target.files[0] } });
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
        if (completedRegistration) {
          return (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Registration Complete!</h3>
              <p className="text-gray-300">
                Thank you for registering for Samyukta 2025. You will receive a confirmation email shortly.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800/40 rounded-lg p-6 border border-gray-700 text-left">
                  <h4 className="text-lg font-bold text-white mb-4">Registration Details</h4>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>Team Size:</strong> {formData.teamSize}</p>
                    <p><strong>Ticket Type:</strong> {formData.tickets.combo ? 'Combo Pass' : 'Workshop Pass'}</p>
                    <p><strong>Total Amount:</strong> ₹{calculatePrice()}</p>
                    <p><strong>Transaction ID:</strong> {formData.payment.transactionId}</p>
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

              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-blue-500 to-violet-500 mt-6"
              >
                Go to Dashboard
              </Button>
            </div>
          );
        }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto">
      <div className="container-narrow section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white">
            Register for <span className="text-blue-400">Samyukta 2025</span>
          </h1>
          <p className="text-lg text-gray-300">
            Join the ultimate tech summit and elevate your skills
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="hidden md:flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className={`flex items-center ${index !== steps.length - 1 ? 'flex-1' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= step.id ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-600 text-gray-400'
                  }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                {index !== steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? 'bg-blue-500' : 'bg-gray-600'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-white">{steps[currentStep - 1].title}</h2>
            <p className="text-sm text-gray-400">Step {currentStep} of {steps.length}</p>
          </div>
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8"
        >
          {renderStepContent()}
        </motion.div>

        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
            className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {currentStep === 6 ? 'Home' : 'Previous'}
          </Button>

          {currentStep === 6 ? null : currentStep === 5 ? (
            <Button
              onClick={handleNext}
              disabled={loading || uploadingPayment}
              className="bg-gradient-to-r from-blue-500 to-violet-500"
            >
              {uploadingPayment ? 'Uploading Payment...' : loading ? 'Processing...' : 'Submit Registration'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-500 to-violet-500"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        <PitchModeDialog
          open={showPitchModeDialog}
          onOpenChange={setShowPitchModeDialog}
          onSelectOffline={() => setShowPitchDialog(true)}
        />

        <StartupPitchDialog
          open={showPitchDialog}
          onOpenChange={(open) => {
            setShowPitchDialog(open);
            if (!open && !formData.startupPitchData[currentPitchMember]) {
              const newTracks = [...formData.memberTracks];
              if (newTracks[currentPitchMember]) {
                newTracks[currentPitchMember] = { ...newTracks[currentPitchMember], competitionTrack: "" };
                setFormData({ ...formData, memberTracks: newTracks });
              }
            }
          }}
          onSave={(pitchData) => {
            setFormData(prev => ({
              ...prev,
              startupPitchData: {
                ...prev.startupPitchData,
                [currentPitchMember]: pitchData
              }
            }));
          }}
          initialData={formData.startupPitchData[currentPitchMember]}
        />
      </div>
    </div>
  );
}