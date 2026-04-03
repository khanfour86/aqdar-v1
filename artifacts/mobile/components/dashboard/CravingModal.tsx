import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  visible: boolean;
  onResisted: () => void;
  onFailed: () => void;
}

export function CravingModal({ visible, onResisted, onFailed }: Props) {
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
          <Text style={[styles.title, { color: colors.foreground }]}>
            خذ نفسًا عميقًا
          </Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            هذه الرغبة ستمر في خلال 3-5 دقائق. أنت أقوى منها.
          </Text>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={onResisted}
          >
            <Ionicons
              name="shield-checkmark"
              size={20}
              color={colors.primaryForeground}
            />
            <Text
              style={[styles.primaryBtnText, { color: colors.primaryForeground }]}
            >
              قاومت الرغبة
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.border }]}
            onPress={onFailed}
          >
            <Text
              style={[styles.secondaryBtnText, { color: colors.mutedForeground }]}
            >
              لم أستطع المقاومة
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
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 24,
  },
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
