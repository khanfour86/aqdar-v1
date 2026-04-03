import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  visible: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function RelapseModal({ visible, onConfirm, onDismiss }: Props) {
  const colors = useColors();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <Ionicons
            name="heart"
            size={36}
            color={colors.primary}
            style={styles.icon}
          />
          <Text style={[styles.title, { color: colors.foreground }]}>
            لا بأس، انهض مرة أخرى
          </Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            التعثر ليس فشلًا، بل جزء من الرحلة. كل خطوة للأمام تهم.
          </Text>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={onConfirm}
          >
            <Ionicons name="refresh" size={20} color={colors.primaryForeground} />
            <Text
              style={[styles.primaryBtnText, { color: colors.primaryForeground }]}
            >
              أعد البداية
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.border }]}
            onPress={onDismiss}
          >
            <Text
              style={[styles.secondaryBtnText, { color: colors.mutedForeground }]}
            >
              إلغاء
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 28,
    paddingBottom: 40,
    alignItems: "center",
  },
  handle: { width: 40, height: 4, borderRadius: 2, marginBottom: 24 },
  icon: { marginBottom: 16 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    width: "100%",
    marginBottom: 12,
  },
  primaryBtnText: { fontSize: 17, fontWeight: "700" },
  secondaryBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    width: "100%",
    alignItems: "center",
  },
  secondaryBtnText: { fontSize: 15 },
});
