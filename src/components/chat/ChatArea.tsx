import { CopilotChat } from "@copilotkit/react-ui";
import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export function ChatArea() {
  // Cast to any to allow custom CSS variables not in the strict type definition
  const copilotKitProps: any = {
    "--copilot-kit-primary-color": "#FFB600",
    "--copilot-kit-background-color": "#FFFFFF",
    "--copilot-kit-response-button-background-color": "#FFB600",
    "--copilot-kit-response-button-text-color": "#000000",
  };


  return (
    <section className="flex-1 flex flex-col bg-white min-w-0 relative overflow-hidden">
      <div style={copilotKitProps} className="h-full">
        <CopilotChat
          instructions="你是一個協助使用者查核事實的助手。請用繁體中文回答，並儘量引用可信來源。"
          labels={{
            title: "Cofacts AI 助手",
            initial: "嗨！👋 今天想查核什麼訊息？",
            placeholder: "輸入訊息以開始查核...",
            error: "發生錯誤，請稍後再試。",
            stopGenerating: "停止生成",
            regenerateResponse: "重新生成",
          }}
        />
      </div>
    </section>
  );
}
