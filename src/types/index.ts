export type LanguageCode = 
  | 'am' // አማርኛ
  | 'gez' // ግዕዝ
  | 'en' // English
  | 'ti' // ትግርኛ
  | 'om' // Afaan Oromoo
  | 'el' // Ελληνικά
  | 'ru' // Русский
  | 'ar' // العربية
  | 'fr'; // Français

export type UserRole = 'patriarch_synod' | 'bishop' | 'priest' | 'deacon' | 'believer';

export interface HierarchyMember {
  id: string;
  name: string;
  title: string;
  diocese: string;
  role: UserRole;
  avatarUrl?: string;
  officialStatement?: string;
  timestamp: string;
}

export interface ConfessionLesson {
  id: string;
  priestName: string;
  priestTitle: string;
  title: string;
  content: string;
  date: string;
  category: 'dogma' | 'repentance' | 'prayer' | 'family';
  scriptureRef: string;
}

export interface PenanceTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  frequency: string;
  assignedDate: string;
}

export interface LiveChatMessage {
  id: string;
  senderName: string;
  role: UserRole;
  originalText: string;
  originalLang: string;
  translatedText?: string;
  timestamp: string;
}

export interface LiturgicalDay {
  ethiopicDate: string;
  gregorianDate: string;
  dayName: string;
  saintOfTheDay: string;
  synaxariumSummary: string;
  fastingStatus: string;
  gospelReading: string;
  epistleReading: string;
}

export interface SacredHymn {
  id: string;
  title: string;
  mode: 'ግዕዝ' | 'ዕዝል' | 'አራራይ';
  composer: string;
  occasion: string;
  audioFrequency?: number;
  duration: string;
  lyricsGeez: string;
  lyricsTranslation: string;
}

export type ConferenceRoomType = 'synod' | 'confession' | 'liturgy' | 'youth';

export interface ConferenceParticipant {
  id: string;
  name: string;
  roleTitle: string;
  location: string;
  role: UserRole;
  avatarUrl: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
  currentSpeech?: string;
  currentTranslation?: Record<string, string>;
}

export interface EngagementComment {
  id: string;
  author: string;
  text: string;
  time: string;
}

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'photo';
  fileUrl: string;
  fileSize: string;
  authorName: string;
  category: string;
  uploadDate: string;
  likes: number;
  hasLiked?: boolean;
  shares: number;
  comments: EngagementComment[];
}

export interface SynodDecreeItem {
  id: string;
  title: string;
  date: string;
  issuer: string;
  content: string;
  diocese: string;
  likes: number;
  hasLiked?: boolean;
  shares: number;
  comments: EngagementComment[];
}

export interface MemberProfile {
  id: string;
  fullName: string;
  baptismalName: string; // የክርስትና ስም
  role: UserRole | 'choir' | 'sunday_school';
  diocese: string; // ሀገረ ስብከት
  parishName: string; // ደብር / ቤተክርስቲያን
  confessorFather: string; // የንስሐ አባት
  preferredLang: LanguageCode;
  email: string;
  phone: string;
  spiritualBio: string;
  avatarUrl: string;
  membershipId: string;
  registeredDate: string;
}
