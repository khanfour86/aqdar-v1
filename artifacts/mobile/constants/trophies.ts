export interface Trophy {
  id: string;
  titleAr: string;
  descriptionAr: string;
  icon: string;
  iconFamily: "Ionicons" | "MaterialCommunityIcons" | "FontAwesome5";
  color: string;
  requirement: {
    type: "days" | "money" | "cravings_resisted";
    value: number;
  };
  isPremium: boolean;
}

export const TROPHIES: Trophy[] = [
  {
    id: "first_step",
    titleAr: "بداية جديدة",
    descriptionAr: "بدأت رحلتك نحو حياة أفضل",
    icon: "star",
    iconFamily: "Ionicons",
    color: "#F4A261",
    requirement: { type: "days", value: 0 },
    isPremium: false,
  },
  {
    id: "day_1",
    titleAr: "أول 24 ساعة",
    descriptionAr: "صمدت ليوم كامل — هذا إنجاز حقيقي",
    icon: "sunny",
    iconFamily: "Ionicons",
    color: "#FFD166",
    requirement: { type: "days", value: 1 },
    isPremium: false,
  },
  {
    id: "days_3",
    titleAr: "3 أيام قوة",
    descriptionAr: "ثلاثة أيام من الإرادة والتحكم",
    icon: "flame",
    iconFamily: "Ionicons",
    color: "#F4A261",
    requirement: { type: "days", value: 3 },
    isPremium: false,
  },
  {
    id: "week_1",
    titleAr: "أسبوع بطولي",
    descriptionAr: "أسبوع كامل بدون عودة — أنت تصنع التغيير",
    icon: "trophy",
    iconFamily: "Ionicons",
    color: "#2EC4B6",
    requirement: { type: "days", value: 7 },
    isPremium: false,
  },
  {
    id: "money_10",
    titleAr: "مدخر الصحة",
    descriptionAr: "وفرت 10 وحدات من ميزانيتك",
    icon: "cash",
    iconFamily: "Ionicons",
    color: "#4ECDC4",
    requirement: { type: "money", value: 10 },
    isPremium: false,
  },
  {
    id: "month_1",
    titleAr: "أول شهر",
    descriptionAr: "30 يومًا من الإرادة الصلبة — أنت قدوة",
    icon: "medal",
    iconFamily: "Ionicons",
    color: "#FFD166",
    requirement: { type: "days", value: 30 },
    isPremium: false,
  },
  {
    id: "cravings_10",
    titleAr: "مقاوم الرغبات",
    descriptionAr: "قاومت 10 رغبات — إرادتك من الصلب",
    icon: "shield-checkmark",
    iconFamily: "Ionicons",
    color: "#2EC4B6",
    requirement: { type: "cravings_resisted", value: 10 },
    isPremium: false,
  },
  {
    id: "days_60",
    titleAr: "شهران متواصلان",
    descriptionAr: "60 يومًا — تحولت عادتك إلى أسلوب حياة",
    icon: "diamond",
    iconFamily: "Ionicons",
    color: "#E2D9F3",
    requirement: { type: "days", value: 60 },
    isPremium: true,
  },
  {
    id: "days_100",
    titleAr: "المئة يوم",
    descriptionAr: "100 يوم من الصمود — أسطورة حقيقية",
    icon: "ribbon",
    iconFamily: "Ionicons",
    color: "#F4A261",
    requirement: { type: "days", value: 100 },
    isPremium: true,
  },
  {
    id: "money_100",
    titleAr: "ثروة الصحة",
    descriptionAr: "وفرت 100 وحدة — أموالك في جيبك",
    icon: "wallet",
    iconFamily: "Ionicons",
    color: "#FFD166",
    requirement: { type: "money", value: 100 },
    isPremium: true,
  },
];
