- premade components: Button, ScrollArea, Textarea, ArrowUpIcon, GenericLoader, PriceHistoryChartCard, WeatherComponent, WeatherComponentNested, PaymentDetails and all components under UI

- setup of ai.tsx (https://sdk.vercel.ai/docs/reference/ai-sdk-rsc/use-ui-state)
  - Mention what "use server"; does
  - explain about AI provider with the initial states and allowed actions
  - describe what createAmazonBedrock does
  - describe what getMutableAIState
  - aiState.mutable
  - streamUI and what do the fields model, text, tools, message do 
  - describe how data is set in tools and how using description and parameters we make the AI smarter to return responses

- get and update messages for the UI
  ```
    const { messages, input, setInput, append } = useChat({
      initialMessages: [
        {
          id: generateId(),
          role: "system",
          content: "Hello, how can I help you?",
        },
      ],
    });
  ```

  
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
        <form ref={formRef} className="relative" onSubmit={onUserMessageSubmit}>
        </form>
      </div>
    ```
    ```
      let inputRef = useRef<HTMLTextAreaElement>(null);
      let formRef = useRef<HTMLFormElement>(null);

      const submitFormAndClearInput = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        formRef.current?.requestSubmit();

        if (inputRef.current) {
          inputRef.current.value = "";
        }
      };
    ```
    ```
      <Textarea
        ref={inputRef}
        placeholder="Type your message..."
        name="message"
        id="message"
        rows={1}
        className="min-h-[48px] rounded-2xl resize-none p-4 border border-neutral-400 shadow-sm pr-16"
        onChange={(e) => onUserInputChange?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            submitFormAndClearInput(e);
          }
        }}
        autoFocus
      />
      <Button
        type="submit"
        size="icon"
        className="absolute w-8 h-8 top-3 right-3"
        onClick={submitFormAndClearInput}
      >
        <ArrowUpIcon className="w-4 h-4" />
        <span className="sr-only">Send</span>
      </Button>
    ```
- setup of message box and talk about Message["role"]
  ```    
    export function MessageBox({
      children,
      from,
    }: {
      children: React.ReactNode;
      from: Message["role"];
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
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      append({ role: "user", content: input });
    };
    <Chat onUserInputChange={setInput} onUserMessageSubmit={handleSubmit} >
    </Chat>
  ```

- add message box to handle the incoming message
  {messages.map((message) => (
    <MessageBox key={message.id} from={message.role}>
      {message.content}
    </MessageBox>
  ))}

- end with trying to add a new tool to the search if time allows