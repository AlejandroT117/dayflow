import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { FlowModal } from "../components/overrides/FlowModal";
import { FlowRow, FlowText } from "../components/overrides";
import { StepsContent } from "../components/tutorial/StepsContent";
import { FlowButton } from "../components/overrides/FlowButton";
import { COLORS, SIZES } from "../variables/styles";
import { AntDesign } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const MAX_STEP = 2;
export const MIN_STEP = 0;

export const TutorialScreen: React.FC<Props> = ({ visible, onClose }) => {
  const [step, setStep] = useState(MIN_STEP);

  const onPreviousStep = useCallback(() => {
    if (step === MIN_STEP) {
      return;
    }
    setStep(step - 1);
  }, [step]);

  const onNextStep = useCallback(() => {
    if (step === MAX_STEP) {
      return;
    }
    setStep(step + 1);
  }, [step]);

  const handleResetTutorial = useCallback(() => {
    onClose();
    setStep(MIN_STEP);
  }, []);

  return (
    <FlowModal
      visible={visible}
      contentStyles={{ backgroundColor: COLORS.lightBlack }}
    >
      <View>
        <View>
          <FlowRow>
            <FlowText style={{ fontWeight: "bold" }}>
              Step {step + 1} / {MAX_STEP + 1}
            </FlowText>
            <FlowButton handlePress={handleResetTutorial} type="danger">
              <AntDesign
                name="closecircleo"
                size={SIZES.fontLarge}
                color={COLORS.brightYellow}
              />
            </FlowButton>
          </FlowRow>
        </View>
        <View>
          <StepsContent step={step} />
        </View>
      </View>
      <View>
        <FlowRow>
          <FlowButton
            text="Back"
            handlePress={onPreviousStep}
            isDisabled={step == MIN_STEP}
          />
          <FlowButton
            text={step < MAX_STEP ? "Next" : "Exit"}
            type={step < MAX_STEP ? "primary" : "danger"}
            handlePress={() =>
              step < MAX_STEP ? onNextStep() : handleResetTutorial()
            }
          />
        </FlowRow>
      </View>
    </FlowModal>
  );
};
