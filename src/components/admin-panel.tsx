'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  User,
  GraduationCap,
  Briefcase,
  FolderOpen,
  FileText,
  Wrench,
  Plus,
  Trash2,
  Save,
  Upload,
  FileUp,
  X,
  Loader2,
  Lock,
  Mail,
  MailOpen,
  Clock,
  Send,
  Settings,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Profile {
  id: string
  name: string
  title: string
  bio: string
  avatarUrl: string
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  twitter: string
  website: string
}

interface Education {
  id: string
  type: string
  institution: string
  title: string
  startDate: string
  endDate: string
  description: string
  certificateUrl: string
  certificateName: string
  order: number
}

interface Experience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  order: number
}

interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  techStack: string
  liveUrl: string
  repoUrl: string
  featured: boolean
  order: number
}

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  coverImageUrl: string
  published: boolean
  slug: string
  createdAt: string
}

interface Skill {
  id: string
  name: string
  category: string
  level: number
  icon: string
  order: number
}

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

interface AdminPanelProps {
  profile: Profile | null
  education: Education[]
  experience: Experience[]
  projects: Project[]
  blogPosts: BlogPost[]
  skills: Skill[]
  messages: ContactMessage[]
  onDataChange: () => void
}

async function uploadFile(file: File): Promise<{ url: string; name: string } | null> {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Upload failed')
    return await res.json()
  } catch (err) {
    console.error('Upload error:', err)
    toast({ title: 'Error al subir archivo', variant: 'destructive' })
    return null
  }
}

export function AdminPanel({
  profile,
  education,
  experience,
  projects,
  blogPosts,
  skills,
  messages,
  onDataChange,
}: AdminPanelProps) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const [profileForm, setProfileForm] = useState<Profile>(
    profile || {
      id: '',
      name: '',
      title: '',
      bio: '',
      avatarUrl: '',
      email: '',
      phone: '',
      location: '',
      github: '',
      linkedin: '',
      twitter: '',
      website: '',
    }
  )

  const [eduForm, setEduForm] = useState<Omit<Education, 'id'>>({
    type: 'course',
    institution: '',
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    certificateUrl: '',
    certificateName: '',
    order: 0,
  })
  const [editingEduId, setEditingEduId] = useState<string | null>(null)
  const [uploadingCert, setUploadingCert] = useState(false)

  const [expForm, setExpForm] = useState<Omit<Experience, 'id'>>({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    order: 0,
  })
  const [editingExpId, setEditingExpId] = useState<string | null>(null)

  const [projForm, setProjForm] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    imageUrl: '',
    techStack: '',
    liveUrl: '',
    repoUrl: '',
    featured: false,
    order: 0,
  })
  const [editingProjId, setEditingProjId] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [blogForm, setBlogForm] = useState<Omit<BlogPost, 'id' | 'createdAt'>>({
    title: '',
    content: '',
    excerpt: '',
    coverImageUrl: '',
    published: false,
    slug: '',
  })
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null)

  const [skillForm, setSkillForm] = useState<Omit<Skill, 'id'>>({
    name: '',
    category: 'frontend',
    level: 50,
    icon: '',
    order: 0,
  })
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null)

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const unreadCount = messages.filter(m => !m.read).length

  const [emailFrom, setEmailFrom] = useState('noreply@tudominio.com')
  const [emailFromSaved, setEmailFromSaved] = useState('')
  const [emailTestSending, setEmailTestSending] = useState(false)
  const [emailTestResult, setEmailTestResult] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.email_from) {
          setEmailFrom(data.email_from)
          setEmailFromSaved(data.email_from)
        }
      })
      .catch(() => {})
  }, [])

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const saveProfile = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Perfil actualizado' })
      onDataChange()
    } catch {
      toast({ title: 'Error al actualizar perfil', variant: 'destructive' })
    }
    setLoading(false)
  }

  const saveEducation = async () => {
    setLoading(true)
    try {
      if (editingEduId) {
        const res = await fetch('/api/education', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingEduId, ...eduForm }),
        })
        if (!res.ok) throw new Error()
        toast({ title: 'Educación actualizada' })
      } else {
        const res = await fetch('/api/education', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eduForm),
        })
        if (!res.ok) throw new Error()
        toast({ title: 'Educación creada' })
      }
      setEduForm({ type: 'course', institution: '', title: '', startDate: '', endDate: '', description: '', certificateUrl: '', certificateName: '', order: 0 })
      setEditingEduId(null)
      onDataChange()
    } catch {
      toast({ title: 'Error al guardar educación', variant: 'destructive' })
    }
    setLoading(false)
  }

  const deleteEducation = async (id: string) => {
    if (!confirm('¿Eliminar este registro de educación?')) return
    try {
      await fetch('/api/education', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      toast({ title: 'Educación eliminada' })
      onDataChange()
    } catch {
      toast({ title: 'Error al eliminar', variant: 'destructive' })
    }
  }

  const saveExperience = async () => {
    setLoading(true)
    try {
      if (editingExpId) {
        const res = await fetch('/api/experience', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingExpId, ...expForm }),
        })
        if (!res.ok) throw new Error()
        toast({ title: 'Experiencia actualizada' })
      } else {
        const res = await fetch('/api/experience', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expForm),
        })
        if (!res.ok) throw new Error()
        toast({ title: 'Experiencia creada' })
      }
      setExpForm({ company: '', role: '', startDate: '', endDate: '', current: false, description: '', order: 0 })
      setEditingExpId(null)
      onDataChange()
    } catch {
      toast({ title: 'Error al guardar experiencia', variant: 'destructive' })
    }
    setLoading(false)
  }

  const deleteExperience = async (id: string) => {
    if (!confirm('¿Eliminar este registro de experiencia?')) return
    try {
      await fetch('/api/experience', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      toast({ title: 'Experiencia eliminada' })
      onDataChange()
    } catch {
      toast({ title: 'Error al eliminar', variant: 'destructive' })
    }
  }

  const saveProject = async () => {
    setLoading(true)
    try {
      if (editingProjId) {
        const res = await fetch('/api/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProjId, ...projForm }),
        })
        if (!res.ok) throw new Error()
        toast({ title: 'Proyecto actualizado' })
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projForm),
        })
        if (!res.ok) throw new Error()
        toast({ title: 'Proyecto creado' })
      }
      setProjForm({ title: '', description: '', imageUrl: '', techStack: '', liveUrl: '', repoUrl: '', featured: false, order: 0 })
      setEditingProjId(null)
      onDataChange()
    } catch {
      toast({ title: 'Error al guardar proyecto', variant: 'destructive' })
    }
    setLoading(false)
  }

  const deleteProject = async (id: string) => {
    if (!confirm('¿Eliminar este proyecto?')) return
    try {
      await fetch('/api/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      toast({ title: 'Proyecto eliminado' })
      onDataChange()
    } catch {
      toast({ title: 'Error al eliminar', variant: 'destructive' })
    }
  }

  const saveBlogPost = async () => {
    setLoading(true)
    try {
      const slug = blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      if (editingBlogId) {
        const res = await fetch('/api/blog', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingBlogId, ...blogForm, slug }),
        })
        if (!res.ok) throw new Error()
        toast({ title: 'Post actualizado' })
      } else {
        const res = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...blogForm, slug }),
        })
        if (!res.ok) throw new Error()
        toast({ title: 'Post creado' })
      }
      setBlogForm({ title: '', content: '', excerpt: '', coverImageUrl: '', published: false, slug: '' })
      setEditingBlogId(null)
      onDataChange()
    } catch {
      toast({ title: 'Error al guardar post', variant: 'destructive' })
    }
    setLoading(false)
  }

  const deleteBlogPost = async (id: string) => {
    if (!confirm('¿Eliminar este post?')) return
    try {
      await fetch('/api/blog', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      toast({ title: 'Post eliminado' })
      onDataChange()
    } catch {
      toast({ title: 'Error al eliminar', variant: 'destructive' })
    }
  }

  const saveSkill = async () => {
    setLoading(true)
    try {
      if (editingSkillId) {
        const res = await fetch('/api/skills', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingSkillId, ...skillForm }),
        })
        if (!res.ok) throw new Error()
        toast({ title: 'Habilidad actualizada' })
      } else {
        const res = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skillForm),
        })
        if (!res.ok) throw new Error()
        toast({ title: 'Habilidad creada' })
      }
      setSkillForm({ name: '', category: 'frontend', level: 50, icon: '', order: 0 })
      setEditingSkillId(null)
      onDataChange()
    } catch {
      toast({ title: 'Error al guardar habilidad', variant: 'destructive' })
    }
    setLoading(false)
  }

  const deleteSkill = async (id: string) => {
    if (!confirm('¿Eliminar esta habilidad?')) return
    try {
      await fetch('/api/skills', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      toast({ title: 'Habilidad eliminada' })
      onDataChange()
    } catch {
      toast({ title: 'Error al eliminar', variant: 'destructive' })
    }
  }

  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCert(true)
    const result = await uploadFile(file)
    if (result) {
      setEduForm(prev => ({ ...prev, certificateUrl: result.url, certificateName: file.name }))
      toast({ title: 'Certificado subido' })
    }
    setUploadingCert(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const result = await uploadFile(file)
    if (result) {
      setProjForm(prev => ({ ...prev, imageUrl: result.url }))
      toast({ title: 'Imagen subida' })
    }
    setUploadingImage(false)
  }

  const eduTypeLabels: Record<string, string> = {
    university: 'Educación Superior',
    certificacion: 'Certificación',
    specialization: 'Especialización',
    diploma: 'Diplomado',
    course: 'Curso',
    recognition: 'Reconocimiento',
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-background/50 border border-gold/10 h-auto gap-1 p-1">
            <TabsTrigger value="profile" className="text-xs data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <User className="h-3 w-3 mr-1" />Perfil
            </TabsTrigger>
            <TabsTrigger value="education" className="text-xs data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <GraduationCap className="h-3 w-3 mr-1" />Educación
            </TabsTrigger>
            <TabsTrigger value="experience" className="text-xs data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Briefcase className="h-3 w-3 mr-1" />Experiencia
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-xs data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <FolderOpen className="h-3 w-3 mr-1" />Proyectos
            </TabsTrigger>
            <TabsTrigger value="blog" className="text-xs data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <FileText className="h-3 w-3 mr-1" />Blog
            </TabsTrigger>
            <TabsTrigger value="skills" className="text-xs data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Wrench className="h-3 w-3 mr-1" />Habilidades
            </TabsTrigger>
            <TabsTrigger value="messages" className="text-xs data-[state=active]:bg-gold/20 data-[state=active]:text-gold relative">
              <Mail className="h-3 w-3 mr-1" />Mensajes
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[16px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="email" className="text-xs data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Settings className="h-3 w-3 mr-1" />Email
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Lock className="h-3 w-3 mr-1" />Seguridad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="text-gold text-xs">Nombre</Label>
                <Input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
              </div>
              <div className="col-span-2">
                <Label className="text-gold text-xs">Título Profesional</Label>
                <Input value={profileForm.title} onChange={e => setProfileForm(p => ({ ...p, title: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
              </div>
              <div className="col-span-2">
                <Label className="text-gold text-xs">Biografía</Label>
                <Textarea value={profileForm.bio} onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))} rows={3} className="bg-background/50 border-gold/20 text-sm" />
              </div>
              <div>
                <Label className="text-gold text-xs">Email</Label>
                <Input value={profileForm.email} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
              </div>
              <div>
                <Label className="text-gold text-xs">Teléfono</Label>
                <Input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
              </div>
              <div className="col-span-2">
                <Label className="text-gold text-xs">Ubicación</Label>
                <Input value={profileForm.location} onChange={e => setProfileForm(p => ({ ...p, location: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
              </div>
              <div>
                <Label className="text-gold text-xs">GitHub URL</Label>
                <Input value={profileForm.github} onChange={e => setProfileForm(p => ({ ...p, github: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
              </div>
              <div>
                <Label className="text-gold text-xs">LinkedIn URL</Label>
                <Input value={profileForm.linkedin} onChange={e => setProfileForm(p => ({ ...p, linkedin: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
              </div>
              <div>
                <Label className="text-gold text-xs">X (Twitter) URL</Label>
                <Input value={profileForm.twitter} onChange={e => setProfileForm(p => ({ ...p, twitter: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
              </div>
              <div>
                <Label className="text-gold text-xs">Sitio Web</Label>
                <Input value={profileForm.website} onChange={e => setProfileForm(p => ({ ...p, website: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
              </div>
            </div>
            <Button onClick={saveProfile} disabled={loading} className="w-full bg-gold text-background hover:bg-gold-light">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Guardar Perfil
            </Button>
          </TabsContent>

          <TabsContent value="education" className="mt-4 space-y-4">
            <Card className="bg-background/30 border-gold/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gold">
                  {editingEduId ? 'Editar Educación' : 'Nueva Educación'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-gold text-xs">Tipo</Label>
                  <Select value={eduForm.type} onValueChange={v => setEduForm(f => ({ ...f, type: v }))}>
                    <SelectTrigger className="bg-background/50 border-gold/20 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="university">Educación Superior</SelectItem>
                      <SelectItem value="certificacion">Certificación</SelectItem>
                      <SelectItem value="specialization">Especialización</SelectItem>
                      <SelectItem value="diploma">Diplomado</SelectItem>
                      <SelectItem value="course">Curso</SelectItem>
                      <SelectItem value="recognition">Reconocimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gold text-xs">Institución</Label>
                  <Input value={eduForm.institution} onChange={e => setEduForm(f => ({ ...f, institution: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div>
                  <Label className="text-gold text-xs">Título</Label>
                  <Input value={eduForm.title} onChange={e => setEduForm(f => ({ ...f, title: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-gold text-xs">Fecha Inicio</Label>
                    <Input value={eduForm.startDate} onChange={e => setEduForm(f => ({ ...f, startDate: e.target.value }))} placeholder="2020" className="bg-background/50 border-gold/20 text-sm" />
                  </div>
                  <div>
                    <Label className="text-gold text-xs">Fecha Fin</Label>
                    <Input value={eduForm.endDate} onChange={e => setEduForm(f => ({ ...f, endDate: e.target.value }))} placeholder="2023" className="bg-background/50 border-gold/20 text-sm" />
                  </div>
                </div>
                <div>
                  <Label className="text-gold text-xs">Descripción</Label>
                  <Textarea value={eduForm.description} onChange={e => setEduForm(f => ({ ...f, description: e.target.value }))} rows={2} className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div>
                  <Label className="text-gold text-xs">Certificado PDF</Label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex items-center gap-2 px-3 py-2 bg-background/50 border border-gold/20 rounded-md cursor-pointer hover:bg-gold/5 transition-colors">
                      <FileUp className="h-4 w-4 text-gold" />
                      <span className="text-xs text-muted-foreground truncate">
                        {eduForm.certificateUrl ? eduForm.certificateName || 'Certificado subido' : 'Subir PDF...'}
                      </span>
                      <input type="file" accept=".pdf" onChange={handleCertUpload} className="hidden" />
                    </label>
                    {eduForm.certificateUrl && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setEduForm(f => ({ ...f, certificateUrl: '', certificateName: '' }))}>
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    {uploadingCert && <Loader2 className="h-4 w-4 animate-spin text-gold" />}
                  </div>
                </div>
                <div>
                  <Label className="text-gold text-xs">Orden</Label>
                  <Input type="number" value={eduForm.order} onChange={e => setEduForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveEducation} disabled={loading} className="flex-1 bg-gold text-background hover:bg-gold-light text-sm">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                    {editingEduId ? 'Actualizar' : 'Crear'}
                  </Button>
                  {editingEduId && (
                    <Button variant="outline" onClick={() => { setEditingEduId(null); setEduForm({ type: 'course', institution: '', title: '', startDate: '', endDate: '', description: '', certificateUrl: '', certificateName: '', order: 0 }) }} className="border-gold/20 text-sm">
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Registros existentes</h4>
              {education.map(edu => (
                <div key={edu.id} className="flex items-center gap-2 p-2 bg-background/30 rounded-md border border-gold/5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{edu.title}</p>
                    <p className="text-[10px] text-muted-foreground">{eduTypeLabels[edu.type] || edu.type} · {edu.institution}</p>
                  </div>
                  {edu.certificateUrl && <Badge variant="outline" className="text-[9px] border-gold/30 text-gold px-1 py-0">PDF</Badge>}
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gold" onClick={() => { setEditingEduId(edu.id); setEduForm({ type: edu.type, institution: edu.institution, title: edu.title, startDate: edu.startDate, endDate: edu.endDate, description: edu.description, certificateUrl: edu.certificateUrl, certificateName: edu.certificateName, order: edu.order }) }}>
                    <Save className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deleteEducation(edu.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experience" className="mt-4 space-y-4">
            <Card className="bg-background/30 border-gold/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gold">
                  {editingExpId ? 'Editar Experiencia' : 'Nueva Experiencia'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-gold text-xs">Empresa</Label>
                  <Input value={expForm.company} onChange={e => setExpForm(f => ({ ...f, company: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div>
                  <Label className="text-gold text-xs">Cargo</Label>
                  <Input value={expForm.role} onChange={e => setExpForm(f => ({ ...f, role: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-gold text-xs">Fecha Inicio</Label>
                    <Input value={expForm.startDate} onChange={e => setExpForm(f => ({ ...f, startDate: e.target.value }))} placeholder="2020" className="bg-background/50 border-gold/20 text-sm" />
                  </div>
                  <div>
                    <Label className="text-gold text-xs">Fecha Fin</Label>
                    <Input value={expForm.endDate} onChange={e => setExpForm(f => ({ ...f, endDate: e.target.value }))} placeholder="Presente" className="bg-background/50 border-gold/20 text-sm" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={expForm.current} onCheckedChange={v => setExpForm(f => ({ ...f, current: v }))} />
                  <Label className="text-xs text-muted-foreground">Trabajo actual</Label>
                </div>
                <div>
                  <Label className="text-gold text-xs">Descripción</Label>
                  <Textarea value={expForm.description} onChange={e => setExpForm(f => ({ ...f, description: e.target.value }))} rows={3} className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div>
                  <Label className="text-gold text-xs">Orden</Label>
                  <Input type="number" value={expForm.order} onChange={e => setExpForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveExperience} disabled={loading} className="flex-1 bg-gold text-background hover:bg-gold-light text-sm">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                    {editingExpId ? 'Actualizar' : 'Crear'}
                  </Button>
                  {editingExpId && (
                    <Button variant="outline" onClick={() => { setEditingExpId(null); setExpForm({ company: '', role: '', startDate: '', endDate: '', current: false, description: '', order: 0 }) }} className="border-gold/20 text-sm">
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Registros existentes</h4>
              {experience.map(exp => (
                <div key={exp.id} className="flex items-center gap-2 p-2 bg-background/30 rounded-md border border-gold/5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{exp.role}</p>
                    <p className="text-[10px] text-muted-foreground">{exp.company} · {exp.startDate} - {exp.endDate}</p>
                  </div>
                  {exp.current && <Badge variant="outline" className="text-[9px] border-green-500/30 text-green-400 px-1 py-0">Actual</Badge>}
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gold" onClick={() => { setEditingExpId(exp.id); setExpForm({ company: exp.company, role: exp.role, startDate: exp.startDate, endDate: exp.endDate, current: exp.current, description: exp.description, order: exp.order }) }}>
                    <Save className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deleteExperience(exp.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-4 space-y-4">
            <Card className="bg-background/30 border-gold/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gold">
                  {editingProjId ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-gold text-xs">Título</Label>
                  <Input value={projForm.title} onChange={e => setProjForm(f => ({ ...f, title: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div>
                  <Label className="text-gold text-xs">Descripción</Label>
                  <Textarea value={projForm.description} onChange={e => setProjForm(f => ({ ...f, description: e.target.value }))} rows={2} className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div>
                  <Label className="text-gold text-xs">Imagen de Preview</Label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex items-center gap-2 px-3 py-2 bg-background/50 border border-gold/20 rounded-md cursor-pointer hover:bg-gold/5 transition-colors">
                      <Upload className="h-4 w-4 text-gold" />
                      <span className="text-xs text-muted-foreground truncate">
                        {projForm.imageUrl ? 'Imagen subida' : 'Subir imagen...'}
                      </span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {uploadingImage && <Loader2 className="h-4 w-4 animate-spin text-gold" />}
                  </div>
                  {projForm.imageUrl && (
                    <div className="mt-2 relative rounded-md overflow-hidden h-24 bg-background/50">
                      <img src={projForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-gold text-xs">Tecnologías (separadas por coma)</Label>
                  <Input value={projForm.techStack} onChange={e => setProjForm(f => ({ ...f, techStack: e.target.value }))} placeholder="React, Node.js, PostgreSQL" className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-gold text-xs">URL Demo</Label>
                    <Input value={projForm.liveUrl} onChange={e => setProjForm(f => ({ ...f, liveUrl: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
                  </div>
                  <div>
                    <Label className="text-gold text-xs">URL Repo</Label>
                    <Input value={projForm.repoUrl} onChange={e => setProjForm(f => ({ ...f, repoUrl: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={projForm.featured} onCheckedChange={v => setProjForm(f => ({ ...f, featured: v }))} />
                  <Label className="text-xs text-muted-foreground">Destacado</Label>
                </div>
                <div>
                  <Label className="text-gold text-xs">Orden</Label>
                  <Input type="number" value={projForm.order} onChange={e => setProjForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveProject} disabled={loading} className="flex-1 bg-gold text-background hover:bg-gold-light text-sm">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                    {editingProjId ? 'Actualizar' : 'Crear'}
                  </Button>
                  {editingProjId && (
                    <Button variant="outline" onClick={() => { setEditingProjId(null); setProjForm({ title: '', description: '', imageUrl: '', techStack: '', liveUrl: '', repoUrl: '', featured: false, order: 0 }) }} className="border-gold/20 text-sm">
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Proyectos existentes</h4>
              {projects.map(proj => (
                <div key={proj.id} className="flex items-center gap-2 p-2 bg-background/30 rounded-md border border-gold/5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{proj.title}</p>
                    <p className="text-[10px] text-muted-foreground">{proj.techStack}</p>
                  </div>
                  {proj.featured && <Badge variant="outline" className="text-[9px] border-gold/30 text-gold px-1 py-0">Destacado</Badge>}
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gold" onClick={() => { setEditingProjId(proj.id); setProjForm({ title: proj.title, description: proj.description, imageUrl: proj.imageUrl, techStack: proj.techStack, liveUrl: proj.liveUrl, repoUrl: proj.repoUrl, featured: proj.featured, order: proj.order }) }}>
                    <Save className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deleteProject(proj.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="blog" className="mt-4 space-y-4">
            <Card className="bg-background/30 border-gold/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gold">
                  {editingBlogId ? 'Editar Post' : 'Nuevo Post'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-gold text-xs">Título</Label>
                  <Input value={blogForm.title} onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div>
                  <Label className="text-gold text-xs">Slug (auto-generado si vacío)</Label>
                  <Input value={blogForm.slug} onChange={e => setBlogForm(f => ({ ...f, slug: e.target.value }))} placeholder="mi-post" className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div>
                  <Label className="text-gold text-xs">Extracto</Label>
                  <Textarea value={blogForm.excerpt} onChange={e => setBlogForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div>
                  <Label className="text-gold text-xs">Contenido (Markdown)</Label>
                  <Textarea value={blogForm.content} onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))} rows={8} className="bg-background/50 border-gold/20 text-sm font-mono" placeholder="# Título&#10;&#10;Contenido del post..." />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={blogForm.published} onCheckedChange={v => setBlogForm(f => ({ ...f, published: v }))} />
                  <Label className="text-xs text-muted-foreground">Publicado</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveBlogPost} disabled={loading} className="flex-1 bg-gold text-background hover:bg-gold-light text-sm">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                    {editingBlogId ? 'Actualizar' : 'Crear'}
                  </Button>
                  {editingBlogId && (
                    <Button variant="outline" onClick={() => { setEditingBlogId(null); setBlogForm({ title: '', content: '', excerpt: '', coverImageUrl: '', published: false, slug: '' }) }} className="border-gold/20 text-sm">
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Posts existentes</h4>
              {blogPosts.map(post => (
                <div key={post.id} className="flex items-center gap-2 p-2 bg-background/30 rounded-md border border-gold/5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{post.title}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(post.createdAt).toLocaleDateString('es-PE')}</p>
                  </div>
                  <Badge variant="outline" className={`text-[9px] px-1 py-0 ${post.published ? 'border-green-500/30 text-green-400' : 'border-yellow-500/30 text-yellow-400'}`}>
                    {post.published ? 'Publicado' : 'Borrador'}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gold" onClick={() => { setEditingBlogId(post.id); setBlogForm({ title: post.title, content: post.content, excerpt: post.excerpt, coverImageUrl: post.coverImageUrl, published: post.published, slug: post.slug }) }}>
                    <Save className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deleteBlogPost(post.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="mt-4 space-y-4">
            <Card className="bg-background/30 border-gold/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gold">
                  {editingSkillId ? 'Editar Habilidad' : 'Nueva Habilidad'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-gold text-xs">Nombre</Label>
                  <Input value={skillForm.name} onChange={e => setSkillForm(f => ({ ...f, name: e.target.value }))} className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div>
                  <Label className="text-gold text-xs">Categoría</Label>
                  <Select value={skillForm.category} onValueChange={v => setSkillForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger className="bg-background/50 border-gold/20 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">Frontend</SelectItem>
                      <SelectItem value="backend">Backend</SelectItem>
                      <SelectItem value="tools">Herramientas</SelectItem>
                      <SelectItem value="soft">Habilidades Blandas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gold text-xs">Nivel ({skillForm.level}%)</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skillForm.level}
                    onChange={e => setSkillForm(f => ({ ...f, level: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-background/50 rounded-lg appearance-none cursor-pointer accent-[oklch(0.78_0.14_75)]"
                  />
                </div>
                <div>
                  <Label className="text-gold text-xs">Icono (Devicon)</Label>
                  <Input value={skillForm.icon} onChange={e => setSkillForm(f => ({ ...f, icon: e.target.value }))} placeholder="ej: react, python, docker" className="bg-background/50 border-gold/20 text-sm" />
                  {skillForm.icon && (
                    <div className="mt-2 flex items-center gap-2 p-2 bg-background/50 rounded-md border border-gold/10">
                      <img
                        src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skillForm.icon}/${skillForm.icon}-original.svg`}
                        alt={skillForm.icon}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          const img = e.currentTarget
                          if (!img.src.endsWith('-plain.svg')) {
                            img.src = img.src.replace('-original.svg', '-plain.svg')
                          } else {
                            img.style.display = 'none'
                          }
                        }}
                      />
                      <span className="text-xs text-muted-foreground">{skillForm.icon}</span>
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground/60 mt-1">Busca el nombre en <a href="https://devicon.dev/" target="_blank" rel="noopener noreferrer" className="text-gold underline">devicon.dev</a></p>
                </div>
                <div>
                  <Label className="text-gold text-xs">Orden</Label>
                  <Input type="number" value={skillForm.order} onChange={e => setSkillForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="bg-background/50 border-gold/20 text-sm" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveSkill} disabled={loading} className="flex-1 bg-gold text-background hover:bg-gold-light text-sm">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                    {editingSkillId ? 'Actualizar' : 'Crear'}
                  </Button>
                  {editingSkillId && (
                    <Button variant="outline" onClick={() => { setEditingSkillId(null); setSkillForm({ name: '', category: 'frontend', level: 50, icon: '', order: 0 }) }} className="border-gold/20 text-sm">
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Habilidades existentes</h4>
              {skills.map(skill => (
                <div key={skill.id} className="flex items-center gap-2 p-2 bg-background/30 rounded-md border border-gold/5">
                  {skill.icon && (
                    <img
                      src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skill.icon}/${skill.icon}-original.svg`}
                      alt={skill.name}
                      className="w-6 h-6 object-contain shrink-0"
                      onError={(e) => {
                        const img = e.currentTarget
                        if (!img.src.endsWith('-plain.svg')) {
                          img.src = img.src.replace('-original.svg', '-plain.svg')
                        } else {
                          img.style.display = 'none'
                        }
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{skill.name}</p>
                    <p className="text-[10px] text-muted-foreground">{skill.category} · {skill.level}%</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gold" onClick={() => { setEditingSkillId(skill.id); setSkillForm({ name: skill.name, category: skill.category, level: skill.level, icon: skill.icon, order: skill.order }) }}>
                    <Save className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deleteSkill(skill.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-background/30 border-gold/10">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-gold-gradient">{messages.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total</p>
                </CardContent>
              </Card>
              <Card className="bg-background/30 border-gold/10">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-cyan-400">{unreadCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">No leídos</p>
                </CardContent>
              </Card>
              <Card className="bg-background/30 border-gold/10">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{messages.filter(m => m.read).length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Leídos</p>
                </CardContent>
              </Card>
            </div>

            {selectedMessage ? (
              <Card className="bg-background/30 border-gold/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-gold flex items-center gap-2">
                      <MailOpen className="h-4 w-4" />
                      {selectedMessage.subject}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedMessage(null); setReplyText('') }} className="text-muted-foreground hover:text-foreground h-7 w-7 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5 bg-gold/10 px-2.5 py-1 rounded-full">
                      <User className="h-3 w-3 text-gold" />
                      <span className="text-foreground font-medium">{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gold/10 px-2.5 py-1 rounded-full">
                      <Mail className="h-3 w-3 text-gold" />
                      <a href={`mailto:${selectedMessage.email}`} className="text-gold hover:underline">{selectedMessage.email}</a>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(selectedMessage.createdAt).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="bg-background/50 rounded-lg border border-gold/10 p-4">
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                  </div>

                  <div className="border-t border-gold/10 pt-4 mt-2">
                    <Label className="text-gold text-xs mb-2 block">Responder a {selectedMessage.name}</Label>
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Escribe tu respuesta aquí..."
                      rows={4}
                      className="bg-background/50 border-gold/15 focus:border-gold/40 focus:ring-gold/20 placeholder:text-muted-foreground/50 resize-none text-sm"
                    />
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        className="flex-1 bg-gold text-background hover:bg-gold-light text-xs py-5"
                        disabled={sendingReply || !replyText.trim()}
                        onClick={async () => {
                          if (!replyText.trim()) return
                          setSendingReply(true)
                          try {
                            const res = await fetch('/api/contact/reply', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                to: selectedMessage.email,
                                subject: `Re: ${selectedMessage.subject}`,
                                message: replyText,
                                replyToId: selectedMessage.id,
                              }),
                            })
                            const data = await res.json()
                            if (!res.ok) throw new Error(data.error || 'Error al enviar')
                            toast({ title: '¡Respuesta enviada!', description: `Email enviado a ${selectedMessage.email}` })
                            setReplyText('')
                            setSelectedMessage({ ...selectedMessage, read: true })
                            onDataChange()
                          } catch (err: any) {
                            toast({ title: 'Error al enviar respuesta', description: err.message || 'Verifica la configuración de email', variant: 'destructive' })
                          }
                          setSendingReply(false)
                        }}
                      >
                        {sendingReply ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-2" />}
                        Enviar Respuesta
                      </Button>
                      {!selectedMessage.read && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gold/20 text-gold hover:bg-gold/10"
                          onClick={async () => {
                            try {
                              await fetch('/api/contact', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: selectedMessage.id, read: true }),
                              })
                              toast({ title: 'Marcado como leído' })
                              setSelectedMessage({ ...selectedMessage, read: true })
                              onDataChange()
                            } catch {
                              toast({ title: 'Error al actualizar', variant: 'destructive' })
                            }
                          }}
                        >
                          <MailOpen className="h-3.5 w-3.5 mr-1.5" />Leído
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                        onClick={async () => {
                          if (!confirm('¿Eliminar este mensaje?')) return
                          try {
                            await fetch(`/api/contact?id=${selectedMessage.id}`, { method: 'DELETE' })
                            toast({ title: 'Mensaje eliminado' })
                            setSelectedMessage(null)
                            setReplyText('')
                            onDataChange()
                          } catch {
                            toast({ title: 'Error al eliminar', variant: 'destructive' })
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : messages.length > 0 ? (
              <div className="space-y-2">
                {messages.map((msg) => (
                  <Card
                    key={msg.id}
                    className={`bg-background/30 border cursor-pointer transition-all hover:border-gold/30 ${
                      msg.read ? 'border-gold/5 opacity-70' : 'border-gold/15'
                    }`}
                    onClick={async () => {
                      setSelectedMessage(msg)
                      if (!msg.read) {
                        try {
                          await fetch('/api/contact', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: msg.id, read: true }),
                          })
                          onDataChange()
                        } catch { /* silent */ }
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {!msg.read && <div className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />}
                            <p className={`text-sm font-medium truncate ${msg.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                              {msg.subject}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{msg.name}</span>
                            <span>·</span>
                            <span>{msg.email}</span>
                          </div>
                          <p className="text-xs text-muted-foreground/60 mt-1 line-clamp-1">{msg.message}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-[10px] text-muted-foreground/60">
                            {new Date(msg.createdAt).toLocaleDateString('es-PE', { month: 'short', day: 'numeric' })}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground/40 hover:text-red-400"
                            onClick={async (e) => {
                              e.stopPropagation()
                              if (!confirm('¿Eliminar este mensaje?')) return
                              try {
                                await fetch(`/api/contact?id=${msg.id}`, { method: 'DELETE' })
                                toast({ title: 'Mensaje eliminado' })
                                onDataChange()
                              } catch {
                                toast({ title: 'Error al eliminar', variant: 'destructive' })
                              }
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-background/30 border-gold/10">
                <CardContent className="p-12 text-center">
                  <Mail className="h-12 w-12 mx-auto mb-3 text-muted-foreground/20" />
                  <p className="text-muted-foreground text-sm">No hay mensajes aún</p>
                  <p className="text-muted-foreground/60 text-xs mt-1">Los mensajes que envíen desde el formulario de contacto aparecerán aquí</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="email" className="mt-4 space-y-4">
            <Card className="bg-background/30 border-gold/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Configuración de Email (Resend)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gold/5 rounded-lg border border-gold/10">
                  <AlertCircle className="h-5 w-5 text-gold shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Configuración necesaria</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Para enviar respuestas, necesitas verificar un dominio en Resend y configurar los registros DNS. Mientras tanto, puedes usar el dominio de prueba de Resend.</p>
                  </div>
                </div>

                <div>
                  <Label className="text-gold text-xs">Email remitente (EMAIL_FROM)</Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Input
                      value={emailFrom}
                      onChange={(e) => setEmailFrom(e.target.value)}
                      placeholder="noreply@tudominio.com"
                      className="bg-background/50 border-gold/20 text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gold/20 text-gold hover:bg-gold/10 shrink-0"
                      onClick={async () => {
                        try {
                          await fetch('/api/settings', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email_from: emailFrom }),
                          })
                          setEmailFromSaved(emailFrom)
                          toast({ title: 'Email remitente guardado' })
                        } catch {
                          toast({ title: 'Error al guardar', variant: 'destructive' })
                        }
                      }}
                    >
                      <Save className="h-3.5 w-3.5 mr-1" />Guardar
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                    Debe ser un email de un dominio verificado en Resend. Para pruebas, usa <code className="text-gold/80 bg-gold/10 px-1 rounded">onboarding@resend.dev</code>
                  </p>
                </div>

                <Separator className="bg-gold/10" />

                <div>
                  <h4 className="text-xs font-medium text-foreground mb-3">Guía de configuración DNS</h4>
                  <div className="space-y-3">
                    <div className="bg-background/50 rounded-lg border border-gold/10 p-3">
                      <p className="text-xs font-medium text-gold mb-2">Paso 1: Ir a Resend → Domains → Add Domain</p>
                      <p className="text-[11px] text-muted-foreground">Ingresa tu dominio (ej: tudominio.com) en el dashboard de Resend</p>
                    </div>
                    <div className="bg-background/50 rounded-lg border border-gold/10 p-3">
                      <p className="text-xs font-medium text-gold mb-2">Paso 2: Agregar registros DNS</p>
                      <p className="text-[11px] text-muted-foreground mb-2">Resend te dará estos registros que debes agregar en tu proveedor DNS:</p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-[10px]">
                          <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-[9px] shrink-0">SPF</Badge>
                          <div>
                            <p className="text-muted-foreground">Tipo: <span className="text-foreground">TXT</span> · Nombre: <span className="text-foreground">@</span> o subdominio</p>
                            <p className="text-muted-foreground">Valor: <code className="text-gold/80 bg-gold/10 px-1 rounded">v=spf1 include:resend.com ~all</code></p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-[10px]">
                          <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-[9px] shrink-0">DKIM</Badge>
                          <p className="text-muted-foreground">Tipo: <span className="text-foreground">CNAME</span> · Resend te dará el nombre y valor específico</p>
                        </div>
                        <div className="flex items-start gap-2 text-[10px]">
                          <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-[9px] shrink-0">DMARC</Badge>
                          <p className="text-muted-foreground">Tipo: <span className="text-foreground">TXT</span> · Nombre: <span className="text-foreground">_dmarc</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-background/50 rounded-lg border border-gold/10 p-3">
                      <p className="text-xs font-medium text-gold mb-2">Paso 3: Verificar dominio</p>
                      <p className="text-[11px] text-muted-foreground">Regresa a Resend y haz clic en "Verify". Puede tomar hasta 48 horas para que los DNS se propaguen.</p>
                    </div>
                    <div className="bg-background/50 rounded-lg border border-gold/10 p-3">
                      <p className="text-xs font-medium text-gold mb-2">Paso 4: Actualizar EMAIL_FROM</p>
                      <p className="text-[11px] text-muted-foreground">Una vez verificado, cambia el email remitente arriba a tu email del dominio verificado (ej: <code className="text-gold/80 bg-gold/10 px-1 rounded">contacto@tudominio.com</code>) y guárdalo.</p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gold/10" />

                <div>
                  <h4 className="text-xs font-medium text-foreground mb-2">Email de prueba</h4>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="tu@email.com"
                      className="bg-background/50 border-gold/20 text-sm"
                      id="test-email-to"
                      defaultValue=""
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gold/20 text-gold hover:bg-gold/10 shrink-0"
                      disabled={emailTestSending}
                      onClick={async () => {
                        const testTo = (document.getElementById('test-email-to') as HTMLInputElement)?.value
                        if (!testTo) {
                          toast({ title: 'Ingresa un email de destino', variant: 'destructive' })
                          return
                        }
                        setEmailTestSending(true)
                        setEmailTestResult('idle')
                        try {
                          const res = await fetch('/api/contact/reply', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              to: testTo,
                              subject: 'Prueba de email - Portafolio',
                              message: '¡Hola! Este es un email de prueba desde tu portafolio. Si lo recibiste, la configuración de Resend funciona correctamente.',
                            }),
                          })
                          const data = await res.json()
                          if (!res.ok) throw new Error(data.error || 'Error al enviar')
                          setEmailTestResult('success')
                          toast({ title: '¡Email de prueba enviado!', description: `Revisa la bandeja de ${testTo}` })
                        } catch (err: any) {
                          setEmailTestResult('error')
                          toast({ title: 'Error al enviar prueba', description: err.message, variant: 'destructive' })
                        }
                        setEmailTestSending(false)
                      }}
                    >
                      {emailTestSending ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-1.5" />}
                      Enviar prueba
                    </Button>
                  </div>
                  {emailTestResult === 'success' && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Email enviado exitosamente
                    </div>
                  )}
                  {emailTestResult === 'error' && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-red-400">
                      <AlertCircle className="h-3.5 w-3.5" /> Error al enviar. Verifica la configuración.
                    </div>
                  )}
                </div>

                <Separator className="bg-gold/10" />

                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-foreground">Configuración actual</h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">API Key</span>
                    <Badge variant="outline" className="border-green-500/30 text-green-400">Configurada ✓</Badge>
                  </div>
                  <Separator className="bg-gold/5" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Email remitente</span>
                    <span className="text-foreground font-mono text-[11px]">{emailFrom}</span>
                  </div>
                  <Separator className="bg-gold/5" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Proveedor</span>
                    <Badge variant="outline" className="border-gold/30 text-gold">Resend</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-4 space-y-4">
            <Card className="bg-background/30 border-gold/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Cambiar Contraseña
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gold/5 rounded-lg border border-gold/10 mb-4">
                  <Lock className="h-5 w-5 text-gold shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Contraseña actual:</p>
                    <p className="text-xs text-muted-foreground">La contraseña se configura en el archivo .env del servidor. Úsala para iniciar sesión y cámbiala aquí si lo deseas.</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gold text-xs">Contraseña Actual</Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={e => { setCurrentPassword(e.target.value); setPasswordError('') }}
                    placeholder="Ingresa tu contraseña actual"
                    className="bg-background/50 border-gold/20 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-gold text-xs">Nueva Contraseña</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setPasswordError('') }}
                    placeholder="Mínimo 6 caracteres"
                    className="bg-background/50 border-gold/20 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-gold text-xs">Confirmar Nueva Contraseña</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setPasswordError('') }}
                    placeholder="Repite la nueva contraseña"
                    className="bg-background/50 border-gold/20 text-sm"
                  />
                </div>
                {passwordError && (
                  <p className="text-destructive text-xs">{passwordError}</p>
                )}
                <Button
                  onClick={async () => {
                    setPasswordError('')
                    if (!currentPassword || !newPassword || !confirmPassword) {
                      setPasswordError('Todos los campos son requeridos')
                      return
                    }
                    if (newPassword.length < 6) {
                      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres')
                      return
                    }
                    if (newPassword !== confirmPassword) {
                      setPasswordError('Las contraseñas no coinciden')
                      return
                    }
                    setPasswordLoading(true)
                    try {
                      const res = await fetch('/api/auth/change-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ currentPassword, newPassword }),
                      })
                      const data = await res.json()
                      if (!res.ok) {
                        setPasswordError(data.error || 'Error al cambiar contraseña')
                      } else {
                        toast({ title: 'Contraseña actualizada', description: 'Tu contraseña ha sido cambiada exitosamente' })
                        setCurrentPassword('')
                        setNewPassword('')
                        setConfirmPassword('')
                      }
                    } catch {
                      setPasswordError('Error de conexión')
                    }
                    setPasswordLoading(false)
                  }}
                  disabled={passwordLoading}
                  className="w-full bg-gold text-background hover:bg-gold-light"
                >
                  {passwordLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                  Cambiar Contraseña
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-background/30 border-gold/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gold">Información de Seguridad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Tipo de acceso</span>
                  <Badge variant="outline" className="border-gold/30 text-gold">Contraseña única</Badge>
                </div>
                <Separator className="bg-gold/10" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Registro de nuevos usuarios</span>
                  <Badge variant="outline" className="border-red-500/30 text-red-400">Deshabilitado</Badge>
                </div>
                <Separator className="bg-gold/10" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Protección de API</span>
                  <Badge variant="outline" className="border-green-500/30 text-green-400">Middleware activo</Badge>
                </div>
                <Separator className="bg-gold/10" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Solo tú puedes acceder al panel de administración. No existe un endpoint de registro, por lo que nadie más puede crear una cuenta. Las operaciones de escritura en la API están protegidas por middleware que verifica la sesión.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}
