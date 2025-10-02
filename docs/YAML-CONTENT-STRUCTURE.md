# YAML Content Structure Guide

**Last Updated:** 2025-10-02
**Purpose:** Standardized YAML content structure for AI Whisperers website

---

## 🎯 Overview

This document defines the correct YAML content structure for all page content files. Following these standards ensures:
- Type safety and TypeScript compatibility
- Consistent component rendering
- No runtime type casting (`as any`)
- Predictable content behavior

---

## 📋 General Principles

### ✅ DO:
- Use **objects with `title` property** for sections with headers
- Use **arrays of objects** for lists with nested properties
- Include all required fields from type definitions (`src/types/content.ts`)
- Match property names exactly to TypeScript interfaces

### ❌ DON'T:
- Use flat arrays for complex structures
- Mix array and object structures for the same content type
- Use `content` when types expect `description`
- Skip required nested properties

---

## 📄 Page-Specific Structures

### About Page (`about.yml`)

#### ✅ CORRECT Structure:

```yaml
meta:
  title: "About Us - AI Whisperers Team | AI Whisperers"
  description: "Learn about the AI Whisperers team and our mission"
  keywords:
    - "about AI Whisperers"
    - "AI education team"
  language: "en"

hero:
  headline: "About AI Whisperers"
  subheadline: "Democratizing AI education for everyone"
  description: "We're on a mission to make AI accessible"
  location: "🌍 Global AI Education"
  primaryCta:
    text: "Start Learning"
    href: "/courses"
    variant: "default"
  secondaryCta:
    text: "Contact Us"
    href: "/contact"
    variant: "outline"
  benefits: []

# ✅ Object with title + content
story:
  title: "Our Story"
  content: |
    At AI Whisperers, we believe that artificial intelligence
    should be accessible to everyone. Our mission is to provide
    world-class AI education.

# ✅ Object with title + description (not content!)
mission:
  title: "Our Mission"
  description: "To democratize AI education through comprehensive, practical courses"

vision:
  title: "Our Vision"
  description: "A world where AI literacy is as fundamental as traditional literacy"

# ✅ Object with title + items array (not flat array!)
values:
  title: "Our Values"
  items:
    - icon: "Award"
      title: "Excellence in Education"
      description: "We maintain the highest standards in course content"
    - icon: "Target"
      title: "Practical Application"
      description: "Every lesson is designed with real-world application in mind"
    - icon: "Heart"
      title: "Inclusive Learning"
      description: "Our courses are accessible regardless of background"

# ✅ Object with title + members array (not flat array!)
team:
  title: "Meet Our Team"
  members:
    - name: "Dr. Sarah Chen"
      role: "Lead AI Instructor"
      bio: "10+ years in AI research and education"
      expertise:
        - "Machine Learning"
        - "Neural Networks"
        - "Computer Vision"
      image:
        src: "/team/sarah.jpg"
        alt: "Dr. Sarah Chen"
    - name: "Marcus Johnson"
      role: "Head of Curriculum"
      bio: "Former Google AI engineer"
      expertise:
        - "Curriculum Design"
        - "AI Engineering"
        - "Educational Technology"
      image:
        src: "/team/marcus.jpg"
        alt: "Marcus Johnson"

# ✅ Object with title + metrics array
stats:
  title: "Our Impact"
  metrics:
    - value: "10,000+"
      description: "Students Taught"
    - value: "50+"
      description: "Courses Created"
    - value: "95%"
      description: "Satisfaction Rate"
    - value: "40+"
      description: "Countries Reached"

# ✅ Contact section (optional on about page)
contact:
  title: "Ready to Start Your AI Journey?"
  description: "Get in touch with our team"
  primaryCta:
    text: "Contact Us"
    href: "/contact"
    variant: "default"
  secondaryCta:
    text: "View Courses"
    href: "/courses"
    variant: "outline"
  info:
    - type: "email"
      label: "Email"
      value: "info@aiwhisperers.com"
    - type: "web"
      label: "Website"
      value: "aiwhisperers.com"

footer:
  brand:
    text: "AI Whisperers"
  copyright: "© 2025 AI Whisperers. All rights reserved."
```

#### ❌ INCORRECT Structure (Current about.yml):

```yaml
# ❌ WRONG: Flat array instead of object with title + items
values:
  - title: "Excellence in Education"
    description: "We maintain the highest standards"

# ❌ WRONG: Flat array instead of object with title + members
team:
  - name: "Name 1"
    role: "Lead AI Instructor"

# ❌ WRONG: Using 'content' instead of 'description' for mission/vision
mission:
  title: "Our Mission"
  content: |  # Should be 'description'
    Our mission text...

# ❌ WRONG: Stats without title and proper structure
stats:
  coursesOffered: "Multiple Levels"  # Should use metrics array
  learningFormat: "Self-Paced Online"
```

---

### Contact Page (`contact.yml`)

#### ✅ CORRECT Structure:

```yaml
meta:
  title: "Contact Us | AI Whisperers"
  description: "Get in touch with the AI Whisperers team"
  keywords:
    - "contact AI Whisperers"
  language: "en"

hero:
  headline: "Get in Touch"
  subheadline: "We're here to help"
  description: "Have questions about our courses?"
  location: "🌍 Available Worldwide"
  primaryCta:
    text: "Send Message"
    href: "#contact-form"
    variant: "default"
  secondaryCta:
    text: "Schedule Call"
    href: "/schedule"
    variant: "outline"
  benefits: []

# ✅ Contact options with proper structure
contactOptions:
  title: "How to Reach Us"
  description: "Choose your preferred contact method"
  options:
    - icon: "Mail"
      title: "Email Us"
      description: "Get response within 24 hours"
      value: "info@aiwhisperers.com"
      primaryMethod: true
      action:
        text: "Send Email"
        href: "mailto:info@aiwhisperers.com"
        external: true
    - icon: "Phone"
      title: "Call Us"
      description: "Monday-Friday, 9AM-6PM PST"
      value: "+1 (555) 123-4567"
      action:
        text: "Call Now"
        href: "tel:+15551234567"
    - icon: "MessageSquare"
      title: "WhatsApp"
      description: "Chat with us directly"
      value: "+595 981 234 567"
      action:
        text: "Open WhatsApp"
        href: "https://wa.me/595981234567"
        external: true

# ✅ Office info with proper nested structure
officeInfo:
  title: "Visit Our Office"
  description: "Stop by our headquarters"
  address:
    street: "Av. Eusebio Ayala 4879"
    neighborhood: "Barrio Mburucuyá"
    city: "Asunción"
    country: "Paraguay"
    zipCode: "1234"
  workingHours:
    weekdays: "Lunes a Viernes: 9:00 - 18:00"
    saturday: "Sábados: 9:00 - 13:00"
    sunday: "Domingos: Cerrado"
  map:
    embedUrl: "https://maps.google.com/..."

# ✅ Consultation form with fields array
consultationForm:
  title: "Request a Consultation"
  description: "Fill out the form below"
  fields:
    - name: "name"
      label: "Full Name"
      type: "text"
      required: true
      placeholder: "John Doe"
    - name: "email"
      label: "Email"
      type: "email"
      required: true
      placeholder: "john@example.com"
    - name: "company"
      label: "Company"
      type: "text"
      required: false
      placeholder: "Your Company"
    - name: "service"
      label: "Service of Interest"
      type: "select"
      required: true
      options:
        - "AI Training Workshops"
        - "Custom AI Solutions"
        - "AI Strategy Consulting"
    - name: "message"
      label: "Message"
      type: "textarea"
      required: true
      rows: 5
      placeholder: "Tell us about your needs..."
  submitButton:
    text: "Send Request"
    loadingText: "Sending..."
  privacyNote: "We respect your privacy and will never share your information"

# ✅ FAQ section
faq:
  title: "Frequently Asked Questions"
  items:
    - question: "What are your response times?"
      answer: "We respond to all inquiries within 24 business hours"
    - question: "Do you offer free consultations?"
      answer: "Yes, we offer a free 30-minute initial consultation"

# ✅ Social proof section
socialProof:
  title: "Trusted by Industry Leaders"
  description: "Join companies that have transformed with AI"
  stats:
    - value: "500+"
      label: "Employees Trained"
    - value: "50+"
      label: "Companies Served"
    - value: "98%"
      label: "Satisfaction Rate"
  testimonials:
    - quote: "AI Paraguay transformed our team's capabilities"
      author: "María González"
      company: "Tech Solutions SA"
    - quote: "Outstanding training and support throughout"
      author: "Carlos Mendez"
      company: "Innovation Corp"

footer:
  brand:
    text: "AI Whisperers"
  copyright: "© 2025 AI Whisperers. All rights reserved."
```

---

### Homepage (`homepage.yml`)

#### ✅ CORRECT Structure:

```yaml
meta:
  title: "AI Whisperers - Master AI Education"
  description: "Comprehensive AI courses"
  keywords:
    - "AI courses"
    - "machine learning"
  language: "en"

hero:
  headline: "Master AI with World-Class Education"
  subheadline: "Transform your career"
  description: "Learn through hands-on projects"
  location: "🌍 Available Worldwide"
  primaryCta:
    text: "Start Learning"
    href: "/courses"
    variant: "default"
  secondaryCta:
    text: "View Courses"
    href: "/courses"
    variant: "outline"
  benefits:
    - icon: "Zap"
      title: "Fast Track Learning"
      description: "Accelerated curriculum"
    - icon: "Award"
      title: "Certifications"
      description: "Earn recognized certificates"

# ✅ Features with nested structure
features:
  differentiators:
    title: "What Makes Us Different"
    description: "Our unique approach to AI education"
    items:
      - icon: "Target"
        title: "Practical Focus"
        description: "Real-world applications"
      - icon: "Users"
        title: "Expert Instructors"
        description: "Learn from industry professionals"

  tools:
    title: "Tools We Teach"
    items:
      - title: "ChatGPT & Gemini"
        description: "Conversational AI platforms"
        color: "bg-green-500"
      - title: "Claude"
        description: "Advanced AI assistant"
        color: "bg-orange-500"

# ✅ Services as flat array (valid for homepage)
services:
  - title: "AI Training Workshops"
    shortDescription: "Comprehensive team training"
    price: "Custom Pricing"
    duration: "2-5 days"
  - title: "AI Strategy Consulting"
    shortDescription: "Strategic AI implementation"
    price: "Consult for quote"
    duration: "Ongoing"

# ✅ Stats with proper structure
stats:
  title: "Our Impact"
  description: "Making a difference in AI education"
  company:
    - value: "10,000+"
      description: "Students Taught"
    - value: "95%"
      description: "Satisfaction Rate"

contact:
  title: "Ready to Start?"
  description: "Get in touch today"
  primaryCta:
    text: "Contact Us"
    href: "/contact"
    variant: "default"
  secondaryCta:
    text: "Learn More"
    href: "/about"
    variant: "outline"
  info:
    - type: "email"
      label: "Email"
      value: "info@aiwhisperers.com"

footer:
  brand:
    text: "AI Whisperers"
  copyright: "© 2025 AI Whisperers. All rights reserved."
```

---

## 🔍 Type Reference

All structures must match TypeScript interfaces in `src/types/content.ts`:

### Key Type Mappings

| YAML Section | TypeScript Interface | Required Properties |
|--------------|---------------------|---------------------|
| `hero` | `Hero` | headline, subheadline, description, location, primaryCta, secondaryCta, benefits |
| `values` | `{ title: string, items: FeatureItem[] }` | title, items (each with icon, title, description) |
| `team` | `{ title: string, members: Array<...> }` | title, members (each with name, role, bio, expertise, image) |
| `stats` | `Stats` | title, description, metrics (or company for compatibility) |
| `contact` | `Contact` | title, description, primaryCta, secondaryCta, info |
| `mission/vision` | `{ title: string, description: string }` | title, **description** (NOT content) |

---

## 🛠️ Migration Guide

### Updating Existing about.yml

```yaml
# BEFORE (Incorrect)
values:
  - title: "Excellence"
    description: "High standards"

# AFTER (Correct)
values:
  title: "Our Values"
  items:
    - icon: "Award"
      title: "Excellence"
      description: "High standards"
```

```yaml
# BEFORE (Incorrect)
mission:
  title: "Our Mission"
  content: |
    Mission text...

# AFTER (Correct)
mission:
  title: "Our Mission"
  description: "Mission text..."
```

```yaml
# BEFORE (Incorrect)
team:
  - name: "John"
    role: "Instructor"

# AFTER (Correct)
team:
  title: "Meet Our Team"
  members:
    - name: "John"
      role: "Instructor"
      bio: "Expert educator"
      expertise: ["AI", "ML"]
      image:
        src: "/team/john.jpg"
        alt: "John Doe"
```

---

## ✅ Validation Checklist

Before committing YAML changes:

- [ ] All sections match TypeScript interfaces in `src/types/content.ts`
- [ ] No flat arrays for complex structures (values, team)
- [ ] Using `description` (not `content`) for mission/vision
- [ ] All required fields present (see type definitions)
- [ ] Proper nesting: objects with title + items/members/metrics
- [ ] Run `npm run compile-content` without errors
- [ ] No `as any` type casts needed in component code

---

## 📚 Related Files

- **Type Definitions:** `src/types/content.ts`
- **Component Implementations:**
  - `src/components/pages/AboutPage.tsx`
  - `src/components/pages/ContactPage.tsx`
  - `src/components/pages/DynamicHomepage.tsx`
- **Content Files:**
  - `src/content/pages/about.yml`
  - `src/content/pages/contact.yml`
  - `src/content/pages/homepage.yml`

---

## 🤖 Bootstrap Contract Compliance

This structure ensures proper bootstrap contracts:
- ✅ Server components receive typed, validated content
- ✅ Client components render without type casting
- ✅ No runtime structure detection needed
- ✅ Compile-time type safety maintained

**Last Validated:** 2025-10-02
**Next Review:** When adding new page types or content sections
