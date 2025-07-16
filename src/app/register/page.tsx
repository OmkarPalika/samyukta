'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Users, Star, ArrowRight, ChevronLeft, User as UserIcon, CreditCard, FileText, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Role = 'Student' | 'Working Professional' | 'Academician' | 'Entrepreneur' | 'Researcher' | 'Other';
type Organization = 'ANITS' | 'College/University' | 'Company' | 'Startup' | 'Freelancer' | 'Other';

interface TeamMember {
  fullName: string;
  email: string;
  whatsapp: string;
  gender: 'Male' | 'Female' | 'Other';
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
  payment: {
    transactionId: string;
    screenshot: File | null;
  };
}

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    teamSize: 1,
    members: [{
      fullName: "",
      email: "",
      whatsapp: "",
      gender: "Male",
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
  const organizations: Organization[] = ['ANITS', 'College/University', 'Company', 'Startup', 'Freelancer', 'Other'];
  const years = ["1st", "2nd", "3rd", "4th", "5th"];

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
          gender: "Male",
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
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      let nextStep = currentStep + 1;
      // Skip step 3 for solo registration
      if (currentStep === 2 && formData.teamSize === 1) {
        nextStep = 4;
      }
      setCurrentStep(Math.min(nextStep, 6));
    }
  };

  const handlePrevious = () => {
    let prevStep = currentStep - 1;
    // Skip step 3 for solo registration when going back
    if (currentStep === 4 && formData.teamSize === 1) {
      prevStep = 2;
    }
    setCurrentStep(Math.max(prevStep, 1));
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
                <Label className="text-gray-300">Full Name *</Label>
                <Input
                  value={teamLead.fullName}
                  onChange={(e) => handleMemberChange(0, 'fullName', e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white"
                  placeholder="Enter full name"
                />
                {errors.teamLeadName && <p className="text-red-400 text-sm">{errors.teamLeadName}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Email *</Label>
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
                <Label className="text-gray-300">WhatsApp Number *</Label>
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
                <Label className="text-gray-300">Role *</Label>
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
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Organization *</Label>
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
              </div>

              {(teamLead.role === "Student" || teamLead.role === "Academician") && (
                <>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Year *</Label>
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
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Department *</Label>
                    <Input
                      value={teamLead.stream}
                      onChange={(e) => handleMemberChange(0, 'stream', e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white"
                      placeholder="e.g. Computer Science and Engineering, Electronics and Communication"
                    />
                    {errors.teamLeadStream && <p className="text-red-400 text-sm">{errors.teamLeadStream}</p>}
                  </div>
                </>
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
          <div className="space-y-6">
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
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 font-medium">Using Team Lead details</span>
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Full Name *</Label>
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
                        <Label className="text-gray-300">Email *</Label>
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
                        <Label className="text-gray-300">WhatsApp Number *</Label>
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
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-bold text-white">Tracks & Pricing</h3>
            <p className="text-gray-300">Track selection and pricing summary will be implemented here</p>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-bold text-white">Payment</h3>
            <p className="text-gray-300">Payment interface will be implemented here</p>
          </div>
        );

      case 6:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Registration Complete!</h3>
            <p className="text-gray-300">Thank you for registering for Samyukta 2025.</p>
          </div>
        );

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
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= step.id ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-600 text-gray-400'
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
            Previous
          </Button>

          {currentStep === 6 ? null : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-500 to-violet-500"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}