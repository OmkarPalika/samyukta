'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PublicLayout from "@/components/layout/PublicLayout";
import { Check, Users, ArrowRight, ChevronLeft, Upload, User as UserIcon, CreditCard, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function DirectJoin() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<{
    totalRegistrations: number;
    availableSlots: number;
    workshopCapacity: number;
    competitionSeats: number;
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/registrations/stats');
        const data = await response.json();
        setStats(data);
        
        // Redirect if direct join is not available
        if (!data.direct_join_available) {
          router.push('/register');
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, [router]);

  const [formData, setFormData] = useState({
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
        foodPreference: "veg" as "veg" | "non-veg"
      }
    ],
    competition: "hackathon", // hackathon or pitch
    payment: {
      transactionId: "",
      screenshot: null as File | null
    }
  });

  const steps = [
    { id: 1, title: "Team Details", icon: Users },
    { id: 2, title: "Member Info", icon: UserIcon },
    { id: 3, title: "Payment", icon: CreditCard },
    { id: 4, title: "Confirmation", icon: Check }
  ];

  const colleges = ["ANITS", "Other"];
  const years = ["1st", "2nd", "3rd", "4th", "5th"];
  const departments = ["CSE", "CSM", "CSD", "IT", "Cybersecurity", "Other"];

  const calculatePrice = () => {
    const basePrice = formData.competition === "hackathon" ? 250 : 200;
    return basePrice * formData.teamSize;
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

          if (member.whatsapp && !/^\d{10}$/.test(member.whatsapp)) {
            newErrors[`member${index}Phone`] = "Enter valid 10-digit phone number";
          }

          if (member.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
            newErrors[`member${index}Email`] = "Enter valid email address";
          }
        });
        break;

      case 3:
        if (!formData.payment.transactionId) {
          newErrors.transactionId = "Transaction ID is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleTeamSizeChange = (size: number) => {
    const newMembers = [...formData.members];

    if (size > formData.teamSize) {
      for (let i = formData.teamSize; i < size; i++) {
        newMembers.push({
          fullName: "",
          email: "",
          whatsapp: "",
          year: "",
          department: "",
          foodPreference: "veg" as "veg" | "non-veg"
        });
      }
    } else if (size < formData.teamSize) {
      newMembers.splice(size);
    }

    setFormData({
      ...formData,
      teamSize: size,
      members: newMembers
    });
  };

  const handleMemberChange = (index: number, field: string, value: string | boolean) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData({ ...formData, members: newMembers });
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      // Mock submission - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep(4);
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
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-400 mr-2" />
                <h4 className="text-orange-400 font-semibold">Direct Competition Entry</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Workshop slots are full! This option provides competition access only with starter kit and certificates.
              </p>
            </div>

            <div>
              <Label className="text-white text-lg mb-4 block">Competition Type</Label>
              <RadioGroup
                value={formData.competition}
                onValueChange={(value) => setFormData({ ...formData, competition: value })}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="hackathon" id="hackathon" />
                    <Label htmlFor="hackathon" className="text-gray-300">Hackathon</Label>
                  </div>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                    ₹250 per person
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="pitch" id="pitch" />
                    <Label htmlFor="pitch" className="text-gray-300">Startup Pitch</Label>
                  </div>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                    ₹200 per person
                  </Badge>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-white text-lg mb-4 block">College/University</Label>
              <RadioGroup
                value={formData.college}
                onValueChange={(value) => setFormData({ ...formData, college: value })}
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
                    onChange={(e) => setFormData({ ...formData, customCollege: e.target.value })}
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
                  </Button>
                ))}
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
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-white">Payment Information</h3>

            <div className="bg-gray-800/40 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-bold text-white mb-4">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>{formData.competition === "hackathon" ? "Hackathon" : "Startup Pitch"} Entry</span>
                  <span>₹{formData.competition === "hackathon" ? 250 : 200}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Team Size</span>
                  <span>x{formData.teamSize}</span>
                </div>
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total Amount</span>
                    <span>₹{calculatePrice()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/40 rounded-lg p-4 md:p-6 border border-gray-700">
                <h4 className="text-lg font-bold text-white mb-4">Payment Details</h4>
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
                  onChange={(e) => setFormData({ ...formData, payment: { ...formData.payment, transactionId: e.target.value } })}
                  className="bg-gray-700/50 border-gray-600 text-white"
                  placeholder="Enter transaction ID"
                />
                {errors.transactionId && <p className="text-red-400 text-sm mt-1">{errors.transactionId}</p>}
              </div>

              <div>
                <Label className="text-gray-300">Payment Screenshot</Label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Registration Complete!</h3>
            <p className="text-gray-300">
              Thank you for registering for the {formData.competition === "hackathon" ? "Hackathon" : "Startup Pitch"} competition.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/40 rounded-lg p-6 border border-gray-700 text-left">
                <h4 className="text-lg font-bold text-white mb-4">Registration Details</h4>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Competition:</strong> {formData.competition === "hackathon" ? "Hackathon" : "Startup Pitch"}</p>
                  <p><strong>College:</strong> {formData.college === "Other" ? formData.customCollege : formData.college}</p>
                  <p><strong>Team Size:</strong> {formData.teamSize}</p>
                  <p><strong>Total Amount:</strong> ₹{calculatePrice()}</p>
                  <p><strong>Status:</strong> Pending Review</p>
                </div>
              </div>

              <div className="bg-blue-500/10 rounded-lg p-6 border border-blue-500/20">
                <h4 className="text-lg font-bold text-blue-400 mb-4">Next Steps</h4>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Your payment will be verified within 24 hours</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>QR codes will be generated after payment confirmation</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Access your dashboard to view QR codes and participate in games</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Check your email for confirmation and updates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!stats) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
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
                Direct <span className="text-orange-400">Competition Entry</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300">
                Join competitions directly with starter kit and certificates
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 px-3 py-1">
                  <Clock className="w-3 h-3 mr-1" />
                  Workshop slots full
                </Badge>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-3 py-1">
                  Competition slots available
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Progress Steps */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <div className="hidden md:flex items-center justify-between mb-6 lg:mb-8">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center ${index !== steps.length - 1 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= step.id
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'border-gray-600 text-gray-400'
                      }`}
                  >
                    <step.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                  {index !== steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 lg:mx-4 ${currentStep > step.id ? 'bg-orange-500' : 'bg-gray-600'
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="text-spacing">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {steps[currentStep - 1].title}
                </h2>
                <p className="text-sm sm:text-base text-gray-400">
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
            className="bg-gray-800/40 backdrop-blur-sm rounded-2xl component-padding border border-gray-700 mb-4 sm:mb-6 lg:mb-8"
          >
            {renderStepContent()}
          </motion.div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white w-full sm:w-auto order-2 sm:order-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === 4 ? (
              <Button
                onClick={() => router.push('/login')}
                className="bg-gradient-to-r from-orange-500 to-red-500 w-full sm:w-auto order-1 sm:order-2"
              >
                Continue to Dashboard
              </Button>
            ) : currentStep === 3 ? (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-red-500 w-full sm:w-auto order-1 sm:order-2"
              >
                {loading ? 'Processing...' : 'Submit Registration'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-orange-500 to-red-500 w-full sm:w-auto order-1 sm:order-2"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {errors.submit && (
            <div className="mt-4 text-center text-red-400">
              {errors.submit}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}