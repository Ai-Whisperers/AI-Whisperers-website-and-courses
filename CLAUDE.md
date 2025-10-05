# 🤖 Claude AI Assistant Context & Instructions

**Project:** AI Whisperers Website and Courses Platform
**Last Updated:** October 5, 2025
**Architecture Quality:** Grade A+ (96%)
**Context Preservation:** CRITICAL - Always read this file first**
**Latest:** 4-Layer Global State Architecture Implemented

---

## 📋 **ESSENTIAL CONTEXT FOR CLAUDE**

When working on this codebase, **ALWAYS**:
1. **Read this CLAUDE.md file FIRST** to understand the current system state
2. **Use the EC4RO-HGN methodology** for architectural analysis and documentation
3. **Check local-reports/** for the latest codebase analysis before making changes
4. **Run architecture commands** to maintain system understanding
5. **Preserve the real data integration** - never use mock data

---

## 🏗️ **CURRENT SYSTEM ARCHITECTURE**

### **Architecture Overview**
- **Total Files:** 245+ files across 6 architectural layers + 4-layer global state
- **Dependencies:** 106 internal file-to-file relationships
- **Architecture Grade:** A+ (96% quality score)
- **Circular Dependencies:** 0 ✅ (maintained at zero)
- **Methodology:** EC4RO-HGN (Extended C4 with Root Orchestration)
- **Global State:** Enterprise 4-Layer Pattern (Security → Logic → Presentation → i18n)

### **Key Architectural Principles**
1. **Database-Free Design** - JWT auth, build-time content compilation
2. **Clean Architecture** - Domain-driven design with proper layer separation
3. **Zero Runtime File I/O** - All content pre-compiled at build time
4. **4-Layer Global State** - Enterprise separation of concerns for frontend
5. **Bilingual i18n** - EN/ES instant switching with SSR compatibility
6. **Real System Data** - Architecture maps reflect actual codebase structure

### **🎯 NEW: 4-Layer Global State Architecture**

**Provider Hierarchy (CRITICAL - Maintain this order):**
```typescript
<SecurityProvider>        // Layer 1: Authentication, Users, Payments, Permissions
  <LogicProvider>         // Layer 2: Routing, Modals, Notifications, Admin, Feature Flags
    <PresentationProvider> // Layer 3: Themes, UI, Styling, Accessibility, Dark Mode
      <I18nProvider>      // Layer 4: Language, Locale, Translations, Formatting
        {children}
      </I18nProvider>
    </PresentationProvider>
  </LogicProvider>
</SecurityProvider>
```

**Why This Order:**
1. **SecurityProvider first** - Controls access to entire app
2. **LogicProvider second** - Depends on security for admin/protected routes
3. **PresentationProvider third** - May depend on user prefs from Security
4. **I18nProvider innermost** - Most isolated, least dependencies

**Key Files:**
- `src/contexts/RootProvider.tsx` - Combines all 4 layers
- `src/contexts/security/` - Layer 1 implementation
- `src/contexts/logic/` - Layer 2 implementation
- `src/contexts/presentation/` - Layer 3 implementation
- `src/contexts/i18n/` - Layer 4 implementation
- `src/utils/storage.ts` - Unified SSR-safe storage with encryption

**Benefits:**
- ✅ Single responsibility per layer
- ✅ Type-safe hooks for each concern
- ✅ SSR-compatible with unified storage
- ✅ Cross-tab state synchronization (BroadcastChannel)
- ✅ Encrypted sensitive data storage
- ✅ Zero circular dependencies maintained

---

## 🎯 **EC4RO-HGN METHODOLOGY**

**ALWAYS use this 4-level hierarchy for system analysis:**

### **Level -1: Root Orchestration** 
- **Focus:** Development artifacts → Running system transformation
- **Components:** Git, NPM deps, Render deployment, build pipeline
- **Files:** 15 files, 12 dependencies, 96% quality

### **Level 0: Master Architecture**
- **Focus:** Major system layers and module boundaries  
- **Components:** 10 main modules across 6 architectural layers
- **Files:** 200+ files, 106 dependencies, 94% quality

### **Level 1: Component Sub-Graphs** 
- **Focus:** Internal component architecture and critical paths
- **Components:** Detailed breakdown of high-coupling components
- **Critical Paths:** Content management, authentication, UI systems

### **Level 2: Implementation Detail**
- **Focus:** Function-level granularity for critical algorithms
- **Components:** Performance-critical code, security implementations

---

## 🛠️ **DEVELOPMENT COMMANDS**

### **Essential Commands**
```bash
# Content compilation (ALWAYS run after content changes)
npm run compile-content

# Development server  
npm run dev

# Production build
npm run build

# Architecture analysis
npm run lint && npm run typecheck
```

### **Architecture Navigation**
- **Interactive Graph:** http://localhost:3000/architecture
- **Real-time API:** http://localhost:3000/api/architecture
- **Critical Path Toggle:** Available in graph interface  
- **Live System Data:** Real-time codebase scanning with refresh capability
- **Dynamic Analysis:** Automatically scans actual file system structure

---

## 📊 **CRITICAL SYSTEM COMPONENTS**

### **High-Priority Components (Monitor Closely)**
1. **Content Management System** (35 files)
   - Status: CRITICAL - Monitor health  
   - Files: src/lib/content/, src/types/content.ts
   - Coupling: 20 afferent, 8 efferent, 0.29 instability

2. **Next.js App Router** (18 files)  
   - Status: Critical importance
   - Files: src/app/page.tsx, src/app/layout.tsx, src/app/api/
   - Coupling: 18 afferent, 25 efferent, 0.58 instability

3. **React Component System** (45 files)
   - Status: High importance, Good health
   - Files: src/components/ui/, src/components/pages/
   - Coupling: 45 afferent, 15 efferent, 0.25 instability

### **System Health Status**
- **🟢 Excellent:** 85 components  
- **🔵 Good:** Major systems functioning well
- **🟡 Monitor:** 5 components (mainly content management)
- **🔴 Refactor:** 0 components ✅

---

## 📁 **KEY DIRECTORIES & FILES**

### **Architecture & Analysis**
```
local-reports/                    # CRITICAL: Latest codebase analysis
├── 07-ec4ro-hgn-enhanced-graph-system.md  # Current methodology
├── 05-complete-architectural-graph-system.md  # Full system map
├── dependency-mapping.txt        # Real dependency relationships
└── graph-methodology/           # EC4RO-HGN methodology docs

src/components/architecture/     # Interactive graph system  
├── DynamicGraphMap.tsx         # MAIN: Real-time visualization component
├── ArchitecturePage.tsx        # Architecture page with dynamic data
├── RealArchitectureData.ts     # Fallback: Static system data
└── GraphMap.tsx                # Legacy: Static visualization

src/lib/architecture/           # CRITICAL: Real-time analysis system
├── CodebaseAnalyzer.ts         # Live file system scanner
└── DynamicArchitectureProvider.ts  # Real-time data provider

src/app/api/architecture/       # Live architecture API
└── route.ts                    # Real-time codebase analysis endpoint
```

### **Core System Files**
```
src/app/architecture/           # Interactive architecture page
src/lib/content/compiled/       # Build-time compiled content
src/types/content.ts           # Critical type definitions (20 imports)
scripts/compile-content.js     # Content compilation system
```

---

## 🔧 **MAINTENANCE INSTRUCTIONS**

### **When Adding New Features**
1. **Check Impact:** Use EC4RO-HGN levels to assess change impact
2. **Update Architecture:** Add new components to RealArchitectureData.ts
3. **Maintain Health:** Ensure coupling metrics stay within bounds
4. **Compile Content:** Run `npm run compile-content` after content changes
5. **Update Docs:** Keep local-reports/ current with any major changes

### **Architecture Analysis Workflow**
1. **Before Major Changes:**
   ```bash
   # Check current state
   npm run lint
   npm run typecheck  
   # Review architecture at /architecture page
   ```

2. **After Major Changes:**
   ```bash
   # Recompile content
   npm run compile-content
   # Test build
   npm run build
   # Update architecture data if needed
   ```

### **Health Monitoring**
- **Weekly:** Check /architecture page for component health
- **Before Releases:** Verify 0 circular dependencies maintained  
- **After Major Features:** Update coupling metrics in RealArchitectureData.ts

---

## 🚨 **CRITICAL PRESERVATION RULES**

### **NEVER**
- Use mock data in architecture visualizations
- Ignore the EC4RO-HGN methodology levels  
- Make changes without checking local-reports/ first
- Break the zero circular dependencies rule
- Skip content compilation after YAML changes

### **ALWAYS**  
- Read this CLAUDE.md file at start of sessions
- Use real system data from codebase analysis OR dynamic system (/api/architecture)
- Maintain the 4-level EC4RO-HGN hierarchy
- Preserve component health indicators  
- Keep dependency metrics updated
- **CRITICAL:** Use DynamicGraphMap for real-time codebase reflection (never lose context)

---

## 🎯 **QUICK REFERENCE**

### **System Stats (Current)**
- **Files:** 215 total
- **Dependencies:** 106 internal  
- **Quality:** Grade A (94%)
- **Health:** 85 excellent, 5 monitor, 0 refactor
- **Architecture:** 4-level EC4RO-HGN with real data integration

### **Key URLs**
- **Development:** http://localhost:3000
- **Architecture:** http://localhost:3000/architecture  
- **Critical Path:** Toggle in architecture interface

### **Emergency Commands**
```bash
# If build fails
npm install && npm run compile-content && npm run build

# If architecture breaks
# Check src/components/architecture/RealArchitectureData.ts
# Verify all imports and component definitions

# If content issues
npm run compile-content
# Check src/lib/content/compiled/ generation
```

---

## 📚 **METHODOLOGY DOCUMENTATION**

**Full EC4RO-HGN Documentation:** `local-reports/graph-methodology/`
- **Blueprint:** EC4RO-HGN_Methodology_Blueprint.md
- **Implementation:** EC4RO-HGN_Implementation_Guide.md  
- **Case Studies:** EC4RO-HGN_Case_Studies.md
- **Framework Summary:** EC4RO-HGN_Framework_Summary.md

**Latest Analysis:** `local-reports/07-ec4ro-hgn-enhanced-graph-system.md`

---

## ⚠️ **CONTEXT PRESERVATION REMINDER**

**This file (CLAUDE.md) is the single source of truth for:**
- Current system architecture understanding
- Development workflow and commands
- Critical component health status  
- EC4RO-HGN methodology application
- Real data vs mock data distinctions

**Always reference this file to maintain continuity across Claude sessions and preserve the architectural intelligence built into this system.**

---

## 🤖 **CLAUDE-SPECIFIC USAGE EXAMPLES**

### **When User Asks: "Add a new feature"**
```bash
# 1. First, understand current architecture
Read local-reports/07-ec4ro-hgn-enhanced-graph-system.md

# 2. Check component health and dependencies  
Visit /architecture page and review impact

# 3. Determine EC4RO-HGN level impact
- Level -1: Does it affect build/deployment?  
- Level 0: New module or affects existing layers?
- Level 1: Internal to existing component?
- Level 2: Just implementation details?

# 4. Make changes preserving architecture
# 5. Update RealArchitectureData.ts if needed
# 6. Test with npm run compile-content && npm run build
```

### **When User Asks: "Fix a bug"**
```bash
# 1. Use EC4RO-HGN to trace the issue
- Check Level -1: Build/deployment issue?
- Check Level 0: Which module contains the bug?  
- Check Level 1: Component internal issue?
- Check Level 2: Implementation bug?

# 2. Use architecture graph to trace dependencies
# 3. Fix preserving coupling metrics
# 4. Verify health status unchanged
```

### **When User Asks: "Optimize performance"**  
```bash
# 1. Check critical path in /architecture interface
# 2. Identify bottlenecks using coupling metrics
# 3. Focus on components marked "Monitor" health
# 4. Use Level 1/2 analysis for specific optimizations
```

### **When User Asks: "Understanding the codebase"**
```bash
# 1. Start with this CLAUDE.md file
# 2. Visit /architecture page for visual overview
# 3. Use progressive disclosure:
   - Level -1: How system runs
   - Level 0: Main modules  
   - Level 1: Component details
   - Level 2: Implementation specifics
# 4. Reference local-reports/ for detailed analysis
```

---

## 🧠 **CLAUDE DECISION FRAMEWORK**

### **Before Making ANY Changes**
1. ✅ Read this CLAUDE.md file  
2. ✅ Check latest analysis in local-reports/
3. ✅ Understand EC4RO-HGN level impact
4. ✅ Review component health status
5. ✅ Consider coupling and dependency impact

### **During Development**
1. ✅ Use real data, never mock data
2. ✅ Maintain zero circular dependencies
3. ✅ Preserve component health indicators  
4. ✅ Follow EC4RO-HGN methodology
5. ✅ Update architecture data when needed

### **After Changes**
1. ✅ Run compile-content if content changed
2. ✅ Verify build succeeds
3. ✅ Check architecture health  
4. ✅ Update this CLAUDE.md if architecture evolved
5. ✅ Document any new patterns or issues

---

## 📝 **CLAUDE SESSION CHECKLIST**

**At Start of Every Session:**
- [ ] Read this CLAUDE.md file completely
- [ ] Check local-reports/ for latest analysis  
- [ ] Visit /architecture page for current state
- [ ] Understand user request in EC4RO-HGN context

**During Work:**
- [ ] Preserve architectural principles
- [ ] Use real system data only
- [ ] Maintain component health
- [ ] Follow methodology levels

**At End of Session:**
- [ ] Test changes with build commands
- [ ] Verify architecture integrity
- [ ] Update documentation if needed
- [ ] Preserve context for next Claude session

---

*End of Claude Context Instructions - Keep this file updated as system evolves*

**🎯 Remember: This file is your architectural compass. Always refer to it to maintain the intelligence and context built into this system across different Claude sessions.**