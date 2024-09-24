- setup of ai.tsx

- get and update messages for the UI
  let [messages, setMessages] = useUIState<typeof AI>();

- setup of Chat

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

- submit the message and await for response before adding the message to the queue
  ``` 
    let { submitUserMessage } = useActions();
  ```

- setup of MessageBox

- Add message box to handle the incoming message
  <MessageBox key={message.id} from={message.role}>
    {message.display}
  </MessageBox>