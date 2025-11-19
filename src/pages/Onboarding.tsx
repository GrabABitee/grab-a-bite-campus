import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Coffee, GraduationCap, MapPin, PlusCircle, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define interfaces for data structures
interface College {
  collegeId: string;
  collegeName: string;
  address: string;
}

interface Cafeteria {
  cafeteriaId: string;
  name: string;
  location: string;
  isOpen: boolean;
  // Add college details if your backend returns it nested, e.g.:
  // college: { collegeId: string; collegeName: string; };
}

// User data structure (matching UserResponse DTO from backend)
interface UserData {
  id: string;
  email: string;
  name?: string;
  roles: string[];
  collegeId?: string; // Now directly available from DTO
  collegeName?: string; // Now directly available from DTO
  cafeteriaId?: string; // Now directly available from DTO
  cafeteriaName?: string; // Now directly available from DTO
  password?: string; // Temporarily stored for Basic Auth header construction
}

export default function Onboarding() {
  // Get user info and type from localStorage ONCE during initial state setup
  const [user, setUser] = useState<UserData | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  // New state to track if user data has been fully initialized from backend
  const [isUserInitialized, setIsUserInitialized] = useState(false);

  // Determine user's specific role type for frontend logic
  let currentUserRoleType: 'admin' | 'cafeteria_owner' | 'student' = 'student';
  if (user?.roles.includes('ADMIN')) {
    currentUserRoleType = 'admin';
  } else if (user?.roles.includes('CAFETERIA_OWNER')) {
    currentUserRoleType = 'cafeteria_owner';
  }

  const [step, setStep] = useState(1);
  const [collegeIdInput, setCollegeIdInput] = useState("");
  const [newCollegeName, setNewCollegeName] = useState("");
  const [newCollegeAddress, setNewCollegeAddress] = useState("");
  const [existingColleges, setExistingColleges] = useState<College[]>([]);
  const [isFetchingColleges, setIsFetchingColleges] = useState(true);

  const [cafeteriaIdInput, setCafeteriaIdInput] = useState("");
  const [newCafeteriaName, setNewCafeteriaName] = useState("");
  const [newCafeteriaLocation, setNewCafeteriaLocation] = useState("");
  const [newCafeteriaIsOpen, setNewCafeteriaIsOpen] = useState(true);
  const [existingCafeterias, setExistingCafeterias] = useState<Cafeteria[]>([]);
  const [isFetchingCafeterias, setIsFetchingCafeterias] = useState(true);
  const [selectedCafeteria, setSelectedCafeteria] = useState<Cafeteria | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const API_BASE_URL = 'http://localhost:8080/api';


  // Function to get Basic Auth header from localStorage user data
  // This useCallback now has no dependencies, making it stable and preventing re-creation
  const getAuthHeader = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const storedEmail = parsedUser?.email;
    // IMPORTANT: Storing password in localStorage is not secure for production.
    // This is for demonstration with Basic Auth. In production, use JWTs or OAuth tokens.
    const storedPassword = localStorage.getItem('signupPassword') || parsedUser?.password; 

    if (storedEmail && storedPassword) {
      const credentials = btoa(`${storedEmail}:${storedPassword}`); 
      return `Basic ${credentials}`;
    }
    return '';
  }, []); // No dependencies: reads directly from localStorage, ensuring stability


  // Function to fetch the most up-to-date user details from the backend
  // This useCallback now depends on user?.id and the stable getAuthHeader
  const fetchCurrentUserDetails = useCallback(async () => {
    const authHeader = getAuthHeader(); // Get the stable auth header
    if (!user?.id || !authHeader) {
      // If user ID or auth header is missing, we can't fetch.
      // Mark as initialized to prevent infinite loops if user is truly not logged in.
      setIsUserInitialized(true); 
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader, // Use the stable authHeader
        },
      });

      if (response.ok) {
        const updatedUser: UserData = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Update localStorage
        setUser(updatedUser); // Update user state with fresh data
        console.log("Fetched current user details:", updatedUser);
      } else {
        console.error("Failed to fetch current user details:", response.status, response.statusText);
        toast({
          title: "Failed to load user data",
          description: `Error: ${response.status} ${response.statusText}. Please try logging in again.`,
          variant: "destructive",
        });
        navigate("/"); // Redirect to login if user data can't be fetched
      }
    } catch (error) {
      console.error("Network error fetching current user details:", error);
      toast({
        title: "Network Error",
        description: "Could not fetch your user data. Please check your connection.",
        variant: "destructive",
      });
      navigate("/"); // Redirect to login on network error
    } finally {
        setIsUserInitialized(true); // Mark user as initialized regardless of fetch success/failure to prevent loop
    }
  }, [user?.id, navigate, toast, getAuthHeader]); // Dependencies: user.id (if user changes), navigate, toast, and the stable getAuthHeader


  const fetchExistingColleges = useCallback(async () => {
    setIsFetchingColleges(true);
    try {
      const response = await fetch(`${API_BASE_URL}/colleges`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
      });

      if (response.ok) {
        const data: College[] = await response.json();
        setExistingColleges(data);
      } else {
        toast({
          title: "Failed to load colleges",
          description: `Error: ${response.status} ${response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching colleges:", error);
      toast({
        title: "Network Error",
        description: "Could not fetch existing colleges. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsFetchingColleges(false);
    }
  }, [getAuthHeader, toast]);


  const fetchExistingCafeterias = useCallback(async (collegeId: string) => {
    setIsFetchingCafeterias(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cafeterias?collegeId=${collegeId}`, { // Filter by collegeId
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
      });

      if (response.ok) {
        const data: Cafeteria[] = await response.json();
        setExistingCafeterias(data);
      } else {
        toast({
          title: "Failed to load cafeterias",
          description: `Error: ${response.status} ${response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching cafeterias:", error);
      toast({
        title: "Network Error",
        description: "Could not fetch existing cafeterias. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsFetchingCafeterias(false);
    }
  }, [getAuthHeader, toast]);


  // --- Effects for fetching data and initial step determination ---
  // Main useEffect for user initialization and step determination
  useEffect(() => {
    if (!user || !user.id || !user.email || !user.roles || user.roles.length === 0) {
      toast({
        title: "Authentication Required",
        description: "Please log in or sign up to continue.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    // Only fetch current user details if not yet initialized
    if (!isUserInitialized) {
        console.log("User not initialized, fetching details...");
        fetchCurrentUserDetails();
        return; // Do not proceed with step determination until user is initialized
    }

    // Determine initial step based on user's existing associations and role
    // This logic runs only after isUserInitialized is true
    console.log("User initialized. Determining step. User:", user);
    if (currentUserRoleType === 'admin') {
      if (user.collegeId && user.cafeteriaId) {
        console.log("Admin: College and Cafeteria set. Navigating to /admin.");
        navigate("/admin"); // Fully set up, go to Admin dashboard
      } else if (user.collegeId) {
        console.log("Admin: College set, proceeding to step 2 (Cafeteria setup).");
        setStep(2); // College set, proceed to cafeteria setup
      } else {
        console.log("Admin: Starting with step 1 (College setup).");
        setStep(1); // Start with college setup
      }
    } else if (currentUserRoleType === 'cafeteria_owner') {
      if (user.collegeId && user.cafeteriaId) {
        console.log("Cafeteria Owner: College and Cafeteria set. Navigating to /cafeteria-dashboard.");
        navigate("/cafeteria-dashboard"); // Assuming this route exists for cafeteria owners
      } else if (user.collegeId) {
        console.log("Cafeteria Owner: College set, proceeding to step 2 (Cafeteria selection/linking).");
        setStep(2); // College set, proceed to cafeteria selection/linking
      } else {
        console.log("Cafeteria Owner: Starting with step 1 (College selection/linking).");
        setStep(1); // Start with college selection/linking
      }
    } else { // Student
      if (user.collegeId && user.cafeteriaId) {
        console.log("Student: College and Cafeteria set. Navigating to /dashboard.");
        navigate("/dashboard"); // Fully set up, go to Student dashboard
      } else if (user.collegeId) {
        console.log("Student: College set, proceeding to step 2 (Cafeteria selection).");
        setStep(2); // College set, proceed to cafeteria selection
      } else {
        console.log("Student: Starting with step 1 (College selection).");
        setStep(1); // Start with college selection
      }
    }
  }, [user, currentUserRoleType, navigate, toast, isUserInitialized, fetchCurrentUserDetails]);


  // Fetch existing colleges when step 1 is active
  useEffect(() => {
    if (step === 1 && user && isUserInitialized) { // Only fetch if user is initialized
      console.log("Step 1 active, fetching colleges with 3s delay...");
      const timer = setTimeout(() => { // Add 3-second delay
        fetchExistingColleges();
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timeout to prevent memory leaks
    }
  }, [step, user, isUserInitialized, fetchExistingColleges]);

  // Fetch existing cafeterias when step 2 is active for admin or student
  useEffect(() => {
    if (step === 2 && user?.collegeId && isUserInitialized) { // Only fetch if user is initialized and collegeId is present
      console.log("Step 2 active, fetching cafeterias with 3s delay...");
      const timer = setTimeout(() => { // Add 3-second delay
        fetchExistingCafeterias(user.collegeId);
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [step, user?.collegeId, isUserInitialized, fetchExistingCafeterias]);


  // --- Handlers for form submissions ---

  // Handle College Setup (Step 1 for all roles)
  const handleCollegeSubmit = async () => {
    setIsLoading(true);
    let targetCollegeId = collegeIdInput;
    let collegeToAssociate: College | undefined;

    try {
      if (currentUserRoleType === 'admin' && newCollegeName && newCollegeAddress) {
        // ADMIN can create new college
        const response = await fetch(`${API_BASE_URL}/colleges`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthHeader(),
          },
          body: JSON.stringify({ collegeName: newCollegeName, address: newCollegeAddress }),
        });

        if (response.ok) {
          collegeToAssociate = await response.json();
          targetCollegeId = collegeToAssociate.collegeId;
          toast({
            title: "College Created!",
            description: `${collegeToAssociate.collegeName} has been added.`,
            variant: "success",
          });
        } else {
          const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
          toast({
            title: "Failed to Create College",
            description: `Error: ${errorData.message || response.statusText}`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      } else if (collegeIdInput) {
        // All roles (including ADMIN if not creating new) can select existing college
        const selected = existingColleges.find(c => c.collegeId === collegeIdInput);
        if (!selected) {
          toast({
            title: "Invalid College ID",
            description: "Please enter a valid existing college ID or select from the list.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        collegeToAssociate = selected;
        targetCollegeId = collegeToAssociate.collegeId;
      } else {
        toast({
          title: "Missing Information",
          description: "Please select a college or provide details to create a new one (Admin only).",
          variant: "warning",
        });
        setIsLoading(false);
        return;
      }

      // Link user to the selected/created college
      if (user && targetCollegeId) {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthHeader(),
          },
          body: JSON.stringify({
            college: {
              collegeId: targetCollegeId
            }
          })        });

        if (response.ok) {
          // After a successful PUT, refetch the user's details to get the updated associations
          // This will trigger the main useEffect to re-evaluate the step
          await fetchCurrentUserDetails(); 
          toast({
            title: "College Linked!",
            description: "Your account is now associated with the college.",
            variant: "success",
          });
        } else {
          const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
          toast({
            title: "Failed to Link College",
            description: `Error: ${errorData.message || response.statusText}`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error during college setup:", error);
      toast({
        title: "Network Error",
        description: "Could not complete college setup. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Cafeteria Setup (Step 2 for Admin & Cafeteria Owner)
  const handleCafeteriaSubmit = async () => {
    setIsLoading(true);
    let targetCafeteriaId = cafeteriaIdInput;
    let cafeteriaToAssociate: Cafeteria | undefined;

    try {
      if (currentUserRoleType === 'admin' && newCafeteriaName && newCafeteriaLocation) {
        // ADMIN can create new cafeteria
        if (!user?.collegeId) { // Check collegeId from DTO
          toast({
            title: "Missing College",
            description: "Please ensure a college is set up for this admin.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        const response = await fetch(`${API_BASE_URL}/cafeterias`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthHeader(),
          },
          body: JSON.stringify({ 
            name: newCafeteriaName, 
            location: newCafeteriaLocation, 
            isOpen: newCafeteriaIsOpen,
            collegeId: user.collegeId // Pass collegeId from DTO
          }),
        });

        if (response.ok) {
          cafeteriaToAssociate = await response.json();
          targetCafeteriaId = cafeteriaToAssociate.cafeteriaId;
          toast({
            title: "Cafeteria Created!",
            description: `${cafeteriaToAssociate.name} has been added.`,
            variant: "success",
          });
        } else {
          const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
          toast({
            title: "Failed to Create Cafeteria",
            description: `Error: ${errorData.message || response.statusText}`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      } else if (cafeteriaIdInput) {
        // All roles (including ADMIN if not creating new) can select existing cafeteria
        const selected = existingCafeterias.find(c => c.cafeteriaId === cafeteriaIdInput);
        if (!selected) {
          toast({
            title: "Invalid Cafeteria ID",
            description: "Please enter a valid existing cafeteria ID or select from the list.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        cafeteriaToAssociate = selected;
        targetCafeteriaId = cafeteriaToAssociate.cafeteriaId;
      } else {
        toast({
          title: "Missing Information",
          description: "Please select a cafeteria or provide details to create a new one (Admin only).",
          variant: "warning",
        });
        setIsLoading(false);
        return;
      }

      // Link user to the selected/created cafeteria
      if (user && targetCafeteriaId) {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthHeader(),
          },
          body: JSON.stringify({ cafeteria: { cafeteriaId: targetCafeteriaId } }),
        });

        if (response.ok) {
          // After a successful PUT, refetch the user's details to get the updated associations
          await fetchCurrentUserDetails(); 
          toast({
            title: "Cafeteria Linked!",
            description: "Your account is now associated with the cafeteria.",
            variant: "success",
          });
          // Redirect based on role after successful cafeteria association (handled by useEffect)
        } else {
          const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
          toast({
            title: "Failed to Link Cafeteria",
            description: `Error: ${errorData.message || response.statusText}`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error during cafeteria setup:", error);
      toast({
        title: "Network Error",
        description: "Could not complete cafeteria setup. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Student Cafeteria Selection (Step 2 for Student)
  const handleStudentCafeteriaSelect = async () => {
    if (!selectedCafeteria) {
      toast({
        title: "Selection Required",
        description: "Please select a cafeteria to continue.",
        variant: "warning",
      });
      return;
    }
    setIsLoading(true);
    try {
      if (user) {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthHeader(),
          },
          body: JSON.stringify({ cafeteria: { cafeteriaId: selectedCafeteria.cafeteriaId } }),
        });

        if (response.ok) {
          // After a successful PUT, refetch the user's details to get the updated associations
          await fetchCurrentUserDetails(); 
          toast({
            title: "Cafeteria Selected!",
            description: "You can now start ordering.",
            variant: "success",
          });
          // The navigation will be handled by the main useEffect after user state updates
        } else {
          const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
          toast({
            title: "Failed to Select Cafeteria",
            description: `Error: ${errorData.message || response.statusText}`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error during student cafeteria selection:", error);
      toast({
        title: "Network Error",
        description: "Could not complete cafeteria selection. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for "Request Credentials" button
  const handleRequestCredentials = () => {
    toast({
      title: "Credentials Request Sent",
      description: "In a real application, this would notify a Super Admin to provide cafeteria login credentials to this Cafeteria Owner.",
      variant: "info",
    });
    // In a real application, this would trigger a backend API call
    // e.g., POST /api/admin/request-cafeteria-credentials (protected for ADMIN)
  };

  // --- Render Logic based on Step and User Type ---

  // Step 1: College Setup (for all roles)
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary-glow/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-elegant border-primary/20">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-2">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Welcome to Grab A Bite! 🍽️
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {currentUserRoleType === 'admin' ? 'Admin Setup - Set up your college' : 'Let\'s find your college first'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Create New College Section (Only for Super Admin) */}
            {currentUserRoleType === 'admin' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <PlusCircle className="h-4 w-4 text-primary" /> Create New College
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="newCollegeName">College Name</Label>
                  <Input 
                    id="newCollegeName" 
                    placeholder="e.g., IIT Delhi" 
                    value={newCollegeName} 
                    onChange={(e) => setNewCollegeName(e.target.value)} 
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newCollegeAddress">Address</Label>
                  <Input 
                    id="newCollegeAddress" 
                    placeholder="e.g., Hauz Khas, New Delhi" 
                    value={newCollegeAddress} 
                    onChange={(e) => setNewCollegeAddress(e.target.value)} 
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {(currentUserRoleType === 'admin' && (newCollegeName || newCollegeAddress)) && ( // Show OR if admin is creating new
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  OR
                </span>
              </div>
            )}
            {/* Always render Select, disable if loading or no colleges */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" /> Select Existing College
              </h3>
              <Select 
                onValueChange={setCollegeIdInput} 
                value={collegeIdInput} 
                disabled={isFetchingColleges || existingColleges.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue 
                    placeholder={isFetchingColleges 
                      ? "Loading colleges..." 
                      : (existingColleges.length > 0 ? "Select a college" : "No colleges available")
                    } 
                  />
                </SelectTrigger>
                <SelectContent>
                  {existingColleges.map((college) => (
                    <SelectItem key={college.collegeId} value={college.collegeId}>
                      {college.collegeName} ({college.address})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {existingColleges.length === 0 && !isFetchingColleges && (
                <p className="text-muted-foreground text-sm mt-2">
                  No existing colleges found. {currentUserRoleType !== 'admin' && 'Please contact your administrator to create one.'}
                </p>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {existingColleges.map((college) => (
                  <Badge
                    key={college.collegeId}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 text-xs"
                    onClick={() => setCollegeIdInput(college.collegeId)}
                  >
                    {college.collegeId.substring(0, 8)}... ({college.collegeName})
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={handleCollegeSubmit}
              className="w-full h-12 mt-6"
              disabled={isLoading || 
                        (currentUserRoleType === 'admin' && (!collegeIdInput && (!newCollegeName || !newCollegeAddress))) ||
                        (currentUserRoleType !== 'admin' && !collegeIdInput)
                       }
              variant="food"
            >
              {isLoading ? "Processing..." : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Don't know your IDs? Contact your college administration
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: Cafeteria Setup (Admin & Cafeteria Owner) OR Cafeteria Selection (Student)
  if (step === 2) {
    if (currentUserRoleType === 'admin' || currentUserRoleType === 'cafeteria_owner') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary-glow/10 flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto shadow-elegant border-primary/20">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-2">
                <Coffee className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {currentUserRoleType === 'admin' ? 'Admin Setup: Cafeteria Details' : 'Cafeteria Owner Setup: Link Cafeteria'}
              </CardTitle>
              <CardDescription className="text-base">
                {currentUserRoleType === 'admin' 
                  ? `Next, let's set up the cafeteria this admin will manage for ${user?.collegeName || 'your college'}.` // Use collegeName from DTO
                  : `Link your Cafeteria Owner account to an existing cafeteria at ${user?.collegeName || 'your college'}.` // Use collegeName from DTO
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Create New Cafeteria Section (Only for Super Admin) */}
              {currentUserRoleType === 'admin' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <PlusCircle className="h-4 w-4 text-primary" /> Create New Cafeteria
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="newCafeteriaName">Cafeteria Name</Label>
                    <Input 
                      id="newCafeteriaName" 
                      placeholder="e.g., Main Campus Cafe" 
                      value={newCafeteriaName} 
                      onChange={(e) => setNewCafeteriaName(e.target.value)} 
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newCafeteriaLocation">Location</Label>
                    <Input 
                      id="newCafeteriaLocation" 
                      placeholder="e.g., Ground Floor, Student Union" 
                      value={newCafeteriaLocation} 
                      onChange={(e) => setNewCafeteriaLocation(e.target.value)} 
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="newCafeteriaIsOpen" 
                      checked={newCafeteriaIsOpen} 
                      onCheckedChange={(checked) => setNewCafeteriaIsOpen(checked)} 
                      disabled={isLoading}
                    />
                    <Label htmlFor="newCafeteriaIsOpen">Is Open</Label>
                  </div>
                </div>
              )}

              {(currentUserRoleType === 'admin' && (newCafeteriaName || newCafeteriaLocation)) && ( // Show OR if admin is creating new
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    OR
                  </span>
                </div>
              )}
              {/* Always render Select, disable if loading or no cafeterias */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Search className="h-4 w-4 text-primary" /> Select Existing Cafeteria
                </h3>
                <Select 
                  onValueChange={setCafeteriaIdInput} 
                  value={cafeteriaIdInput}
                  disabled={isFetchingCafeterias || existingCafeterias.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue 
                      placeholder={isFetchingCafeterias 
                        ? "Loading cafeterias..." 
                        : (existingCafeterias.length > 0 ? "Select a cafeteria" : "No cafeterias available")
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {existingCafeterias.map((cafeteria) => (
                      <SelectItem key={cafeteria.cafeteriaId} value={cafeteria.cafeteriaId}>
                        {cafeteria.name} ({cafeteria.location})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {existingCafeterias.length === 0 && !isFetchingCafeterias && (
                  <p className="text-muted-foreground text-sm mt-2">
                    No existing cafeterias found for {user?.collegeName || 'your college'}. {currentUserRoleType !== 'admin' && 'Please contact your administrator to create one.'}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {existingCafeterias.map((cafeteria) => (
                    <Badge
                      key={cafeteria.cafeteriaId}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10 text-xs"
                      onClick={() => setCafeteriaIdInput(cafeteria.cafeteriaId)}
                    >
                      {cafeteria.cafeteriaId.substring(0, 8)}... ({cafeteria.name})
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleCafeteriaSubmit}
                  disabled={isLoading || 
                            (currentUserRoleType === 'admin' && (!cafeteriaIdInput && (!newCafeteriaName || !newCafeteriaLocation))) ||
                            (currentUserRoleType !== 'admin' && !cafeteriaIdInput)
                           }
                  variant="food" 
                  className="flex-1"
                >
                  {isLoading ? "Processing..." : "Complete Setup"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* "Request Credentials" Button (Only for Cafeteria Owner) */}
              {currentUserRoleType === 'cafeteria_owner' && (
                <div className="text-center mt-4">
                  <Button variant="link" onClick={handleRequestCredentials} disabled={isLoading}>
                    Request Cafeteria Credentials
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    } else { // Student Cafeteria Selection
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary-glow/10 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl mx-auto shadow-elegant border-primary/20">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-2">
                <Coffee className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Choose Your Cafeteria</CardTitle>
              <p className="text-muted-foreground text-sm">
                Select a cafeteria from {user?.collegeName || 'your college'}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {isFetchingCafeterias ? (
                  <p className="text-muted-foreground text-center">Loading cafeterias...</p>
                ) : existingCafeterias.length > 0 ? (
                  existingCafeterias.map((cafe) => (
                    <Card 
                      key={cafe.cafeteriaId} 
                      className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                        selectedCafeteria?.cafeteriaId === cafe.cafeteriaId 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedCafeteria(cafe)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-foreground">{cafe.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {cafe.location}
                            </div>
                            <div className="flex gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {cafe.isOpen ? 'Open' : 'Closed'}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                ID: {cafe.cafeteriaId.substring(0, 8)}...
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center">No cafeterias found for your college.</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleStudentCafeteriaSelect}
                  disabled={!selectedCafeteria || isLoading}
                  variant="food"
                  className="flex-1"
                >
                  {isLoading ? (
                    "Setting up..."
                  ) : (
                    <>
                      Start Ordering
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Fallback if step is out of bounds (shouldn't happen with correct flow)
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
