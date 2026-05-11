import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {

  const { auth } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [existingColleges, setExistingColleges] = useState<any[]>([]);
  const [existingCafeterias, setExistingCafeterias] = useState<any[]>([]);

  const [collegeIdInput, setCollegeIdInput] = useState("");
  const [cafeteriaIdInput, setCafeteriaIdInput] = useState("");
  const [rememberCollege, setRememberCollege] = useState(false);

  const [newCollegeName, setNewCollegeName] = useState("");
  const [newCollegeAddress, setNewCollegeAddress] = useState("");

  const [newCafeteriaName, setNewCafeteriaName] = useState("");
  const [newCafeteriaLocation, setNewCafeteriaLocation] = useState("");
  const [newCafeteriaIsOpen, setNewCafeteriaIsOpen] = useState(true);

  const role = user?.role?.[0];

  /* ================= LOAD USER ================= */

  // useEffect(() => {

  //   if (!auth?.token) {
  //     navigate("/");
  //     return;
  //   }

  //   const loadUser = async () => {
  //     try {

  //       const data = await api.getCurrentUser();
  //       setUser(data);

  //       // onboarding finished
  //       if (data?.college && data?.cafeteria) {

  //         if (role === "ADMIN") navigate("/admin");
  //         else navigate("/dashboard");

  //         return;
  //       }

  //       // college already selected
  //       if (data?.college) {
  //         setStep(2);
  //       }

  //     } catch (err) {
  //       navigate("/");
  //     }
  //   };

  //   loadUser();

  // }, [auth, navigate, role]);
  const loadUser = async () => {
    try {
  
      const data = await api.getCurrentUser();
      setUser(data);
  
      const isAdmin = data.roles.includes("ADMIN");
      const isCafeAdmin = data.roles.includes("CAFETERIA_ADMIN");
  
      // ✅ ADMIN → skip onboarding
      if (isAdmin) {
        navigate("/admin/entry");
        return;
      }
  
      // ✅ CAFETERIA ADMIN
      if (isCafeAdmin && data?.cafeteriaId) {
        navigate("/admin/entry");
        return;
      }
  
      // ✅ STUDENT FLOW
  
      if (data?.collegeId && data?.rememberCollege) {
        setStep(2);
        return;
      }
  
      setStep(1);
  
    } catch {
      navigate("/");
    }
  };
  useEffect(() => {
    if(!auth?.token){
      navigate("/");
      return;
    }
  loadUser();
  },[auth]);
  

  /* ================= LOAD COLLEGES ================= */

  useEffect(() => {

    if (step !== 1) return;

    const loadColleges = async () => {
      try {

        const colleges = await api.getColleges();
        setExistingColleges(colleges);

      } catch {
        toast({
          title: "Failed to load colleges",
          variant: "destructive",
        });
      }
    };

    loadColleges();

  }, [step, toast]);

  /* ================= LOAD CAFETERIAS ================= */
  console.log("USER:", user);
  console.log("COLLEGE ID:", user?.collegeId);
  console.log("STEP:", step);
  useEffect(() => {

    if (step !== 2 ) return;
    if (!user?.collegeId) return;
    const loadCafeterias = async () => {
      try {

        const cafes = await api.getCafeterias(user.collegeId);
        setExistingCafeterias(cafes);

      } catch {
        toast({
          title: "Failed to load cafeterias",
          variant: "destructive",
        });
      }
    };

    loadCafeterias();

  }, [step, user, toast]);

  /* ================= COLLEGE SUBMIT ================= */
  const handleCollegeSubmit = async () => {

    if (!collegeIdInput && !(newCollegeName && newCollegeAddress)) {
      toast({
        title: "Please select or create a college",
        variant: "destructive",
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
  
      let targetCollegeId = collegeIdInput;
  const isAdmin = user?.roles.includes("ADMIN");
      if (role === "ADMIN" && newCollegeName && newCollegeAddress) {
  
        const college = await api.createCollege({
          collegeName: newCollegeName,
          address: newCollegeAddress,
        });
  
        targetCollegeId = college.collegeId;
      }
  
      await api.updateCurrentUser({
        college: { collegeId: targetCollegeId },
        rememberCollege: rememberCollege
      });
  
      const updated = await api.getCurrentUser();
  
      setUser(updated);
      setStep(2);
  
      toast({
        title: "College linked successfully",
      });
  
    } catch {
  
      toast({
        title: "Error linking college",
        variant: "destructive",
      });
  
    } finally {
      setIsLoading(false);
    }
  };
  // const handleCollegeSubmit = async () => {

  //   if (!collegeIdInput && !(newCollegeName && newCollegeAddress)) {
  //     toast({
  //       title: "Please select or create a college",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {

  //     let targetCollegeId = collegeIdInput;

  //     if (role === "ADMIN" && newCollegeName && newCollegeAddress) {

  //       const college = await api.createCollege({
  //         collegeName: newCollegeName,
  //         address: newCollegeAddress,
  //       });

  //       targetCollegeId = college.collegeId;
  //     }

  //     await api.updateCurrentUser({
  //       college: { collegeId: targetCollegeId },
  //     });

  //     const updated = await api.getCurrentUser();

  //     setUser(updated);
  //     setStep(2);

  //     toast({
  //       title: "College linked successfully",
  //     });

  //   } catch {

  //     toast({
  //       title: "Error linking college",
  //       variant: "destructive",
  //     });

  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  /* ================= CAFETERIA SUBMIT ================= */

  // const handleCafeteriaSubmit = async () => {

  //   if (!cafeteriaIdInput && !(newCafeteriaName && newCafeteriaLocation)) {
  //     toast({
  //       title: "Please select or create a cafeteria",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {

  //     let targetCafeteriaId = cafeteriaIdInput;

  //     if (role === "ADMIN" && newCafeteriaName && newCafeteriaLocation) {

  //       const cafeteria = await api.createCafeteria({
  //         name: newCafeteriaName,
  //         location: newCafeteriaLocation,
  //         isOpen: newCafeteriaIsOpen,
  //         collegeId: user.collegeId,
  //       });

  //       targetCafeteriaId = cafeteria.cafeteriaId;
  //     }

  //     localStorage.setItem("cafeteriaId",targetCafeteriaId);

  //     toast({
  //       title: "Setup completed",
  //     });

  //     if (role === "ADMIN") navigate("/admin");
  //     else navigate("/dashboard");

  //   } catch {

  //     toast({
  //       title: "Error completing setup",
  //       variant: "destructive",
  //     });

  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleCafeteriaSubmit = async () => {

    if (!cafeteriaIdInput) {
      toast({
        title: "Please select a cafeteria",
        variant: "destructive",
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
  
      await api.updateCurrentUser({
        cafeteria: { cafeteriaId: cafeteriaIdInput }
      });
  
      const updated = await api.getCurrentUser();
      setUser(updated);
  
      toast({
        title: "Setup completed",
      });
  
      if (updated.roles.includes("ADMIN") || updated.roles.includes("CAFETERIA_ADMIN")) {
        navigate("/admin/entry");
      } else {
        navigate("/dashboard");
      }
  
    } catch {
      toast({
        title: "Error completing setup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  /* ================= STEP 1 UI ================= */

  if (step === 1) {

    return (
      <div className="min-h-screen flex items-center justify-center p-4">

        <Card className="w-full max-w-md">

          <CardHeader>
            <CardTitle>Choose Your College</CardTitle>
            <CardDescription>
              Select or create college
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            {role === "ADMIN" && (
              <>
                <Input
                  placeholder="New College Name"
                  value={newCollegeName}
                  onChange={(e) => setNewCollegeName(e.target.value)}
                />

                <Input
                  placeholder="New College Address"
                  value={newCollegeAddress}
                  onChange={(e) => setNewCollegeAddress(e.target.value)}
                />
              </>
            )}

            <Select onValueChange={setCollegeIdInput}>

              <SelectTrigger>
                <SelectValue placeholder="Select College" />
              </SelectTrigger>

              <SelectContent>
                {existingColleges.map((c) => (
                  <SelectItem key={c.collegeId} value={c.collegeId}>
                    {c.collegeName}
                  </SelectItem>
                ))}
              </SelectContent>

            </Select>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm">Remember this college</span>

              <Switch
                checked={rememberCollege}
                onCheckedChange={setRememberCollege}
              />
            </div>

            <Button
              onClick={handleCollegeSubmit}
              disabled={isLoading}
              className="w-full"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

          </CardContent>

        </Card>

      </div>
    );
  }

  /* ================= STEP 2 UI ================= */

  return (
    <div className="min-h-screen flex items-center justify-center p-4">

      <Card className="w-full max-w-md">

        <CardHeader>
          <CardTitle>Choose Cafeteria</CardTitle>
          <CardDescription>
            Select or create cafeteria
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {role === "ADMIN" && (
            <>
              <Input
                placeholder="New Cafeteria Name"
                value={newCafeteriaName}
                onChange={(e) => setNewCafeteriaName(e.target.value)}
              />

              <Input
                placeholder="Location"
                value={newCafeteriaLocation}
                onChange={(e) => setNewCafeteriaLocation(e.target.value)}
              />

              <Switch
                checked={newCafeteriaIsOpen}
                onCheckedChange={setNewCafeteriaIsOpen}
              />
            </>
          )}

        <Select onValueChange={setCafeteriaIdInput}>
          <SelectTrigger>
            <SelectValue placeholder="Select Cafeteria" />
          </SelectTrigger>

          <SelectContent>
            {existingCafeterias.map((c) => (
              <SelectItem key={c.cafeteriaId} value={c.cafeteriaId}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

          <Button
            onClick={handleCafeteriaSubmit}
            disabled={isLoading}
            className="w-full"
          >
            Complete Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

        </CardContent>

      </Card>

    </div>
  );
}