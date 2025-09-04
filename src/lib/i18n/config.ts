// Internationalization Configuration
// Complete i18n system for the educational platform

import { Language, LanguageConfig } from './types'

export const SUPPORTED_LANGUAGES: Record<Language, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  es: {
    code: 'es', 
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸'
  },
  pt: {
    code: 'pt',
    name: 'Portuguese', 
    nativeName: 'Português',
    flag: '🇧🇷'
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français', 
    flag: '🇫🇷'
  }
}

export const DEFAULT_LANGUAGE: Language = 'en'
export const FALLBACK_LANGUAGE: Language = 'en'

// Translation files
export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      courses: 'Courses', 
      about: 'About',
      blog: 'Blog',
      contact: 'Contact',
      dashboard: 'Dashboard',
      signIn: 'Sign In',
      signOut: 'Sign Out'
    },
    // Courses
    courses: {
      title: 'AI Courses',
      subtitle: 'Master AI with comprehensive courses from beginner to expert',
      enrollButton: 'Enroll Now',
      viewDetails: 'View Details',
      duration: 'Duration',
      difficulty: 'Difficulty',
      price: 'Price',
      free: 'Free',
      featured: 'Featured',
      learningObjectives: 'What you\'ll learn',
      prerequisites: 'Prerequisites',
      allCourses: 'All Courses',
      beginner: 'Beginner',
      intermediate: 'Intermediate', 
      advanced: 'Advanced',
      expert: 'Expert',
      noCourses: 'No courses found',
      noCoursesDescription: 'No courses match your current filters.'
    },
    // Authentication
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      welcomeBack: 'Welcome back',
      createAccount: 'Create your account',
      continueWithGoogle: 'Continue with Google',
      continueWithGitHub: 'Continue with GitHub',
      sendMagicLink: 'Send magic link',
      checkEmail: 'Check your email',
      magicLinkSent: 'We\'ve sent a magic link to your email',
      backToSignIn: 'Back to sign in',
      noAccount: 'Don\'t have an account?',
      haveAccount: 'Already have an account?',
      emailVerificationRequired: 'Email Verification Required',
      verifyEmailMessage: 'Please verify your email address to access this content.'
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      ok: 'OK',
      yes: 'Yes',
      no: 'No'
    },
    // Landing page
    landing: {
      heroTitle: 'Master AI with World-Class Education',
      heroSubtitle: 'From beginner to expert - comprehensive AI courses for everyone',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      featuredCourses: 'Featured Courses',
      whyChooseUs: 'Why Choose AI Whisperers?',
      comprehensiveCurriculum: 'Comprehensive Curriculum',
      expertInstructors: 'Expert Instructors',
      practicalProjects: 'Practical Projects',
      communitySupport: 'Community Support'
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      courses: 'Cursos',
      about: 'Acerca de',
      blog: 'Blog', 
      contact: 'Contacto',
      dashboard: 'Panel',
      signIn: 'Iniciar Sesión',
      signOut: 'Cerrar Sesión'
    },
    courses: {
      title: 'Cursos de IA',
      subtitle: 'Domina la IA con cursos integrales desde principiante hasta experto',
      enrollButton: 'Inscribirse Ahora',
      viewDetails: 'Ver Detalles',
      duration: 'Duración',
      difficulty: 'Dificultad',
      price: 'Precio',
      free: 'Gratis',
      featured: 'Destacado',
      learningObjectives: 'Lo que aprenderás',
      prerequisites: 'Requisitos previos',
      allCourses: 'Todos los Cursos',
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
      expert: 'Experto',
      noCourses: 'No se encontraron cursos',
      noCoursesDescription: 'No hay cursos que coincidan con tus filtros actuales.'
    },
    auth: {
      signIn: 'Iniciar Sesión',
      signUp: 'Registrarse',
      signOut: 'Cerrar Sesión',
      email: 'Correo electrónico',
      password: 'Contraseña',
      welcomeBack: 'Bienvenido de nuevo',
      createAccount: 'Crea tu cuenta',
      continueWithGoogle: 'Continuar con Google',
      continueWithGitHub: 'Continuar con GitHub',
      sendMagicLink: 'Enviar enlace mágico',
      checkEmail: 'Revisa tu correo',
      magicLinkSent: 'Hemos enviado un enlace mágico a tu correo',
      backToSignIn: 'Volver al inicio de sesión',
      noAccount: '¿No tienes cuenta?',
      haveAccount: '¿Ya tienes cuenta?',
      emailVerificationRequired: 'Verificación de correo requerida',
      verifyEmailMessage: 'Por favor verifica tu dirección de correo para acceder a este contenido.'
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      close: 'Cerrar',
      ok: 'OK',
      yes: 'Sí',
      no: 'No'
    },
    landing: {
      heroTitle: 'Domina la IA con Educación de Clase Mundial',
      heroSubtitle: 'De principiante a experto - cursos integrales de IA para todos',
      getStarted: 'Comenzar',
      learnMore: 'Aprende Más',
      featuredCourses: 'Cursos Destacados',
      whyChooseUs: '¿Por Qué Elegir AI Whisperers?',
      comprehensiveCurriculum: 'Currículo Integral',
      expertInstructors: 'Instructores Expertos',
      practicalProjects: 'Proyectos Prácticos',
      communitySupport: 'Soporte Comunitario'
    }
  },
  pt: {
    nav: {
      home: 'Início',
      courses: 'Cursos',
      about: 'Sobre',
      blog: 'Blog',
      contact: 'Contato',
      dashboard: 'Painel',
      signIn: 'Entrar',
      signOut: 'Sair'
    },
    courses: {
      title: 'Cursos de IA',
      subtitle: 'Domine IA com cursos abrangentes do iniciante ao especialista',
      enrollButton: 'Inscrever-se Agora',
      viewDetails: 'Ver Detalhes',
      duration: 'Duração',
      difficulty: 'Dificuldade',
      price: 'Preço',
      free: 'Grátis',
      featured: 'Destaque',
      learningObjectives: 'O que você aprenderá',
      prerequisites: 'Pré-requisitos',
      allCourses: 'Todos os Cursos',
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado',
      expert: 'Especialista',
      noCourses: 'Nenhum curso encontrado',
      noCoursesDescription: 'Nenhum curso corresponde aos seus filtros atuais.'
    },
    auth: {
      signIn: 'Entrar',
      signUp: 'Cadastrar',
      signOut: 'Sair',
      email: 'Email',
      password: 'Senha',
      welcomeBack: 'Bem-vindo de volta',
      createAccount: 'Crie sua conta',
      continueWithGoogle: 'Continuar com Google',
      continueWithGitHub: 'Continuar com GitHub',
      sendMagicLink: 'Enviar link mágico',
      checkEmail: 'Verifique seu email',
      magicLinkSent: 'Enviamos um link mágico para seu email',
      backToSignIn: 'Voltar ao login',
      noAccount: 'Não tem conta?',
      haveAccount: 'Já tem conta?',
      emailVerificationRequired: 'Verificação de email necessária',
      verifyEmailMessage: 'Por favor verifique seu endereço de email para acessar este conteúdo.'
    },
    common: {
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      edit: 'Editar',
      back: 'Voltar',
      next: 'Próximo',
      previous: 'Anterior',
      close: 'Fechar',
      ok: 'OK',
      yes: 'Sim',
      no: 'Não'
    },
    landing: {
      heroTitle: 'Domine IA com Educação de Classe Mundial',
      heroSubtitle: 'Do iniciante ao especialista - cursos abrangentes de IA para todos',
      getStarted: 'Começar',
      learnMore: 'Saiba Mais',
      featuredCourses: 'Cursos em Destaque',
      whyChooseUs: 'Por Que Escolher AI Whisperers?',
      comprehensiveCurriculum: 'Currículo Abrangente',
      expertInstructors: 'Instrutores Especialistas',
      practicalProjects: 'Projetos Práticos',
      communitySupport: 'Suporte da Comunidade'
    }
  },
  fr: {
    nav: {
      home: 'Accueil',
      courses: 'Cours',
      about: 'À propos',
      blog: 'Blog',
      contact: 'Contact',
      dashboard: 'Tableau de bord',
      signIn: 'Se connecter',
      signOut: 'Se déconnecter'
    },
    courses: {
      title: 'Cours IA',
      subtitle: 'Maîtrisez l\'IA avec des cours complets du débutant à l\'expert',
      enrollButton: 'S\'inscrire maintenant',
      viewDetails: 'Voir les détails',
      duration: 'Durée',
      difficulty: 'Difficulté',
      price: 'Prix',
      free: 'Gratuit',
      featured: 'En vedette',
      learningObjectives: 'Ce que vous apprendrez',
      prerequisites: 'Prérequis',
      allCourses: 'Tous les cours',
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé',
      expert: 'Expert',
      noCourses: 'Aucun cours trouvé',
      noCoursesDescription: 'Aucun cours ne correspond à vos filtres actuels.'
    },
    auth: {
      signIn: 'Se connecter',
      signUp: 'S\'inscrire',
      signOut: 'Se déconnecter',
      email: 'Email',
      password: 'Mot de passe',
      welcomeBack: 'Bon retour',
      createAccount: 'Créez votre compte',
      continueWithGoogle: 'Continuer avec Google',
      continueWithGitHub: 'Continuer avec GitHub',
      sendMagicLink: 'Envoyer le lien magique',
      checkEmail: 'Vérifiez votre email',
      magicLinkSent: 'Nous avons envoyé un lien magique à votre email',
      backToSignIn: 'Retour à la connexion',
      noAccount: 'Pas de compte?',
      haveAccount: 'Vous avez déjà un compte?',
      emailVerificationRequired: 'Vérification d\'email requise',
      verifyEmailMessage: 'Veuillez vérifier votre adresse email pour accéder à ce contenu.'
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      close: 'Fermer',
      ok: 'OK',
      yes: 'Oui',
      no: 'Non'
    },
    landing: {
      heroTitle: 'Maîtrisez l\'IA avec une éducation de classe mondiale',
      heroSubtitle: 'Du débutant à l\'expert - des cours d\'IA complets pour tous',
      getStarted: 'Commencer',
      learnMore: 'En savoir plus',
      featuredCourses: 'Cours en vedette',
      whyChooseUs: 'Pourquoi choisir AI Whisperers?',
      comprehensiveCurriculum: 'Programme complet',
      expertInstructors: 'Instructeurs experts',
      practicalProjects: 'Projets pratiques',
      communitySupport: 'Support communautaire'
    }
  }
}