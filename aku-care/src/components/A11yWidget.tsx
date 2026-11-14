import { useEffect } from "react";

export function A11yWidget() {
  useEffect(() => {
    import("visua11y-agent/slim").then(({ createVisua11yAgent }) => {
      createVisua11yAgent({
        lang: "id",
        position: "bottom-right", 
        offset: [24, 24], 
        buttonSize: 40, 
        iconSize: 24,
      });
    });
  }, []);

  return null;
}