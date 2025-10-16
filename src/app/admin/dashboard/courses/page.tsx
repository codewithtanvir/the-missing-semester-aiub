'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Course } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  BookOpen,
  GraduationCap
} from "lucide-react";

export default function CoursesManagementPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  
  // Form state
  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formSemester, setFormSemester] = useState("");
  const [formInstructor, setFormInstructor] = useState("");
  const [formCredits, setFormCredits] = useState("");
  const [saving, setSaving] = useState(false);
  
  const supabase = createClient();
  const { toast } = useToast();

  const departments = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Engineering",
    "Business",
    "Economics",
    "Psychology",
    "History",
    "English"
  ];

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('code', { ascending: true });

      if (error) throw error;
      if (data) setCourses(data);
    } catch (error: any) {
      console.error('Error loading courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormCode("");
    setFormName("");
    setFormDepartment("");
    setFormDescription("");
    setFormSemester("");
    setFormInstructor("");
    setFormCredits("");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const courseData = {
        code: formCode,
        name: formName,
        department: formDepartment,
        description: formDescription || null,
        semester: formSemester || null,
        instructor: formInstructor || null,
        credits: formCredits ? parseInt(formCredits) : null,
      };
      
      const supabaseClient: any = supabase;
      const { error } = await supabaseClient.from('courses').insert([courseData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course added successfully",
      });

      setAddDialogOpen(false);
      resetForm();
      await loadCourses();
    } catch (error: any) {
      console.error('Error adding course:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add course",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse) return;

    setSaving(true);
    try {
      const updateData = {
        code: formCode,
        name: formName,
        department: formDepartment,
        description: formDescription || null,
        semester: formSemester || null,
        instructor: formInstructor || null,
        credits: formCredits ? parseInt(formCredits) : null,
      };
      
      const supabaseClient: any = supabase;
      const { error } = await supabaseClient
        .from('courses')
        .update(updateData)
        .eq('id', currentCourse.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course updated successfully",
      });

      setEditDialogOpen(false);
      setCurrentCourse(null);
      resetForm();
      await loadCourses();
    } catch (error: any) {
      console.error('Error updating course:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update course",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!currentCourse) return;

    try {
      // Check if course has files
      const { count } = await supabase
        .from('files')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', currentCourse.id);

      if (count && count > 0) {
        toast({
          title: "Cannot Delete",
          description: `This course has ${count} file(s). Please delete them first.`,
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', currentCourse.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course deleted successfully",
      });

      setDeleteDialogOpen(false);
      setCurrentCourse(null);
      await loadCourses();
    } catch (error: any) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (course: Course) => {
    setCurrentCourse(course);
    setFormCode(course.code);
    setFormName(course.name);
    setFormDepartment(course.department);
    setFormDescription(course.description || "");
    setFormSemester(course.semester || "");
    setFormInstructor(course.instructor || "");
    setFormCredits(course.credits?.toString() || "");
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (course: Course) => {
    setCurrentCourse(course);
    setDeleteDialogOpen(true);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || course.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-6xl font-extralight text-neutral-900 tracking-tight">Courses</h2>
          <p className="text-neutral-500 mt-3 font-light">Add, edit, and organize courses</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <button 
              onClick={resetForm}
              className="px-8 py-4 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-all duration-300 flex items-center gap-2 font-light shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              Add Course
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Create a new course in the system
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-code">Course Code *</Label>
                    <Input
                      id="add-code"
                      placeholder="CS101"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-department">Department *</Label>
                    <select
                      id="add-department"
                      value={formDepartment}
                      onChange={(e) => setFormDepartment(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      <option value="">Select department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-name">Course Name *</Label>
                  <Input
                    id="add-name"
                    placeholder="Introduction to Computer Science"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-description">Description</Label>
                  <Textarea
                    id="add-description"
                    placeholder="Course description..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-semester">Semester</Label>
                    <Input
                      id="add-semester"
                      placeholder="Fall 2024"
                      value={formSemester}
                      onChange={(e) => setFormSemester(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-instructor">Instructor</Label>
                    <Input
                      id="add-instructor"
                      placeholder="Dr. Smith"
                      value={formInstructor}
                      onChange={(e) => setFormInstructor(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-credits">Credits</Label>
                    <Input
                      id="add-credits"
                      type="number"
                      placeholder="3"
                      value={formCredits}
                      onChange={(e) => setFormCredits(e.target.value)}
                      min="1"
                      max="12"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? "Adding..." : "Add Course"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-100 bg-white p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-light text-neutral-500 uppercase tracking-wider">Total Courses</p>
            <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-5xl font-extralight text-neutral-900">{courses.length}</p>
        </div>
        <div className="rounded-2xl border border-neutral-100 bg-white p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-light text-neutral-500 uppercase tracking-wider">Departments</p>
            <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-5xl font-extralight text-neutral-900">
            {new Set(courses.map(c => c.department)).size}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-100 bg-white p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-light text-neutral-500 uppercase tracking-wider">Active Semester</p>
            <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-2xl font-light text-neutral-900">
            {courses.find(c => c.semester)?.semester || '--'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-neutral-200 focus:border-neutral-900 focus:outline-none transition-all duration-300 font-light"
            />
          </div>
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-neutral-200 focus:border-neutral-900 focus:outline-none transition-all duration-300 font-light bg-white"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="rounded-2xl border border-neutral-100 bg-white overflow-hidden">
        <div className="p-8 border-b border-neutral-100">
          <h3 className="text-2xl font-light text-neutral-900">Courses <span className="text-neutral-400">({filteredCourses.length})</span></h3>
          <p className="text-neutral-500 mt-1 font-light text-sm">All courses in the system</p>
        </div>
        <div className="p-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-200 border-t-neutral-900 mx-auto"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-neutral-50 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-neutral-400" />
              </div>
              <p className="text-neutral-500 font-light">No courses found</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-8">
              <div className="inline-block min-w-full align-middle px-8">
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-neutral-100 hover:bg-transparent">
                        <TableHead className="whitespace-nowrap font-light text-neutral-500">Code</TableHead>
                        <TableHead className="whitespace-nowrap font-light text-neutral-500">Name</TableHead>
                        <TableHead className="whitespace-nowrap font-light text-neutral-500">Department</TableHead>
                        <TableHead className="whitespace-nowrap font-light text-neutral-500">Instructor</TableHead>
                        <TableHead className="whitespace-nowrap font-light text-neutral-500">Credits</TableHead>
                        <TableHead className="text-right whitespace-nowrap font-light text-neutral-500">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.map((course) => (
                        <TableRow key={course.id} className="border-neutral-100 hover:bg-neutral-50 transition-colors duration-200">
                          <TableCell className="font-medium whitespace-nowrap text-neutral-900">{course.code}</TableCell>
                          <TableCell className="whitespace-nowrap font-light text-neutral-700">{course.name}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <span className="px-3 py-1 rounded-full bg-neutral-50 text-neutral-700 text-sm font-light border border-neutral-200">
                              {course.department}
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-light text-neutral-600">{course.instructor || '--'}</TableCell>
                          <TableCell className="whitespace-nowrap font-light text-neutral-600">{course.credits || '--'}</TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditDialog(course)}
                                className="p-2 rounded-full hover:bg-neutral-100 transition-colors duration-200"
                              >
                                <Edit className="h-4 w-4 text-neutral-600" />
                              </button>
                              <button
                                onClick={() => openDeleteDialog(course)}
                                className="p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Course Code *</Label>
                  <Input
                    id="edit-code"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department *</Label>
                  <select
                    id="edit-department"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-name">Course Name *</Label>
                <Input
                  id="edit-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-semester">Semester</Label>
                  <Input
                    id="edit-semester"
                    value={formSemester}
                    onChange={(e) => setFormSemester(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-instructor">Instructor</Label>
                  <Input
                    id="edit-instructor"
                    value={formInstructor}
                    onChange={(e) => setFormInstructor(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-credits">Credits</Label>
                  <Input
                    id="edit-credits"
                    type="number"
                    value={formCredits}
                    onChange={(e) => setFormCredits(e.target.value)}
                    min="1"
                    max="12"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving ? "Updating..." : "Update Course"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentCourse?.code}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
