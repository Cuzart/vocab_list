import useBoop from "@/hooks/useBoop";
import { Button, ButtonProps } from "@mantine/core";
import { animated } from "react-spring";

export const BoopButton = ({
  icon,
  ...props
}: ButtonProps & { icon: React.ReactNode; onClick: () => void }) => {
  const [style, trigger] = useBoop({ rotation: 5, timing: 300 });
  return (
    <Button
      leftSection={<animated.div style={style}>{icon}</animated.div>}
      onMouseEnter={trigger}
      {...props}
    />
  );
};
