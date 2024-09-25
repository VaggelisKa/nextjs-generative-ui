- premade components: Button, ScrollArea, Textarea, ArrowUpIcon, GenericLoader, PriceHistoryChartCard, WeatherComponent, WeatherComponentNested, PaymentDetails and all components under UI

- setup of ai.tsx
  - explain about AI provider with the initial states and allowed actions
  - describe what createAmazonBedrock does
  - describe what getMutableAIState
  - aiState.mutable
  - streamUI and what do the fields model, text, tools, message do 
  - describe how data is set in tools and how using description and parameters we make the AI smarter to return responses

- get and update messages for the UI
  - what does `let [messages, setMessages] = useUIState<typeof AI>();` do

  
- submit the message and await for response before adding the message to the queue
  -what does this do ``` let { submitUserMessage } = useActions(); ```

- setup of Chat
  - ```
      let messagesEndRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }
      }, [children]);

      return (
        <div className="flex flex-col h-dvh w-full bg-white">
        </div>
      );
    ```
  - ```
      <ScrollArea
        className="flex-1 overflow-y-auto p-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="space-y-8">{children}</div>
        <div className="invisible" ref={messagesEndRef} aria-hidden />
      </ScrollArea>
    ```
  - ```
      <div className="p-4">
        <form className="relative" onSubmit={onUserMessageSubmit}>
        </form>
      </div>
    ```
  - ```
      <Textarea
        placeholder="Type your message..."
        name="message"
        id="message"
        rows={1}
        className="min-h-[48px] rounded-2xl resize-none p-4 border border-neutral-400 shadow-sm pr-16"
        onChange={(e) => onUserInputChange?.(e.target.value)}
      />
    ```
  - ```
      <Button
        type="submit"
        size="icon"
        className="absolute w-8 h-8 top-3 right-3"
      >
        <ArrowUpIcon className="w-4 h-4" />
        <span className="sr-only">Send</span>
      </Button>
    ```
- setup of message box
  ```
    export function MessageBox({
      children,
      from,
    }: {
      children: React.ReactNode;
      from: "user" | "assistant";
    }) {
      return (
        <ul className="flex items-start gap-2 justify-start w-full">
          <Avatar className="w-6 h-6 border">
            <AvatarImage
              src={from === "user" ? "/user.jpg" : "/chatbot.png"}
              alt=""
            />
            <AvatarFallback>{from === "user" ? "U" : "CB"}</AvatarFallback>
          </Avatar>
          <li className="text-black text-sm leading-6">{children}</li>
        </ul>
      );
    }
  ```

- add chat screen
  <Chat>
  </Chat>

- add a way to submit the messages
  ```
    const handleSubmit = async (e: any) => {
      e?.preventDefault();

      let userMessage = e?.target.message.value;

      setMessages((messages: ClientMessage[]) => [
        ...messages,
        { id: generateId(), role: "user", display: userMessage },
      ]);

      let response = await submitUserMessage(userMessage);

      setMessages((messages: ClientMessage[]) => [...messages, response]);
    };
  ```
  <Chat onUserMessageSubmit={handleSubmit}>
  </Chat>

- add message box to handle the incoming message
  <MessageBox key={message.id} from={message.role}>
    {message.display}
  </MessageBox>

- end with trying to add a new tool to the search if time allows