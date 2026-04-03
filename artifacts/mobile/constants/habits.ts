import { HabitType } from "@/store/types";

export interface HabitTemplate {
  type: HabitType;
  nameAr: string;
  icon: string;
  iconFamily: "Ionicons" | "MaterialCommunityIcons" | "FontAwesome5";
  color: string;
  fields: HabitField[];
}

export interface HabitField {
  key: string;
  labelAr: string;
  type: "number" | "select";
  required: boolean;
  options?: { value: string; labelAr: string }[];
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  {
    type: "smoking",
    nameAr: "التدخين",
    icon: "smoking-off",
    iconFamily: "MaterialCommunityIcons",
    color: "#E63946",
    fields: [
      {
        key: "packsPerDay",
        labelAr: "عدد العلب يوميًا",
        type: "number",
        required: true,
      },
      {
        key: "dailyCost",
        labelAr: "التكلفة اليومية",
        type: "number",
        required: true,
      },
      {
        key: "quitMode",
        labelAr: "طريقة الإقلاع",
        type: "select",
        required: true,
        options: [
          { value: "immediate", labelAr: "فوري" },
          { value: "gradual", labelAr: "تدريجي" },
        ],
      },
    ],
  },
  {
    type: "vaping",
    nameAr: "الفيب",
    icon: "weather-fog",
    iconFamily: "MaterialCommunityIcons",
    color: "#8338EC",
    fields: [
      {
        key: "dailyCost",
        labelAr: "التكلفة اليومية",
        type: "number",
        required: true,
      },
      {
        key: "quitMode",
        labelAr: "طريقة الإقلاع",
        type: "select",
        required: true,
        options: [
          { value: "immediate", labelAr: "فوري" },
          { value: "gradual", labelAr: "تدريجي" },
        ],
      },
    ],
  },
  {
    type: "social_media",
    nameAr: "وسائل التواصل",
    icon: "phone-off",
    iconFamily: "MaterialCommunityIcons",
    color: "#3A86FF",
    fields: [
      {
        key: "dailyCost",
        labelAr: "ساعات يوميًا (للمتابعة)",
        type: "number",
        required: false,
      },
    ],
  },
  {
    type: "digital_content",
    nameAr: "المحتوى الرقمي الضار",
    icon: "eye-off",
    iconFamily: "MaterialCommunityIcons",
    color: "#E63946",
    fields: [
      {
        key: "dailyCost",
        labelAr: "التكلفة اليومية (اختياري)",
        type: "number",
        required: false,
      },
    ],
  },
  {
    type: "caffeine",
    nameAr: "الكافيين",
    icon: "coffee-off",
    iconFamily: "MaterialCommunityIcons",
    color: "#F4A261",
    fields: [
      {
        key: "dailyCost",
        labelAr: "التكلفة اليومية",
        type: "number",
        required: false,
      },
    ],
  },
  {
    type: "custom",
    nameAr: "عادة مخصصة",
    icon: "plus-circle",
    iconFamily: "MaterialCommunityIcons",
    color: "#2EC4B6",
    fields: [
      {
        key: "customName",
        labelAr: "اسم العادة",
        type: "number",
        required: true,
      },
      {
        key: "dailyCost",
        labelAr: "التكلفة اليومية",
        type: "number",
        required: false,
      },
    ],
  },
];
