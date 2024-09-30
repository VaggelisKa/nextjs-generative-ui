- setup of ai.tsx (https://sdk.vercel.ai/docs/reference/ai-sdk-rsc/use-ui-state)
  - Mention what "use server"; does
  - We start by adding the messages to the aiState as in a queue
  ```
    const aiState = getMutableAIState();

    aiState.update((messages: ServerMessage[]) => [
      ...messages,
      {
        role: "user",
        content: message,
      },
    ]);
  ```
  - setup the initial UI streaming
  ```
    const result = await streamUI({
      model: bedrock("anthropic.claude-3-sonnet-20240229-v1:0"),
      system: `
        You are a helpful banking assistant and you can help users manage their finances. If the user asks anything outside of 
        the banking space please respond with "I am sorry, I don't know how to help you with that."
      `,
      messages: [...aiState.get()],
      text: ({ content, done }) => {
        if (done) {
          aiState.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content,
            },
          ]);
        }

        return <div>{content}</div>;
      }
      tools: {}
    });

    return {
      id: generateId(),
      role: "assistant",
      display: result.value,
    };
  ```
  - describe what createAmazonBedrock does
  - describe what getMutableAIState
  - add how to show the message
  ```
    messages: [...aiState.get()],
  ```
  - handle the AI response as html
  ```
    text: ({ content, done }) => {
      if (done) {
        aiState.done((messages: ServerMessage[]) => [
          ...messages,
          {
            role: "assistant",
            content,
          },
        ]);
      }

      return <div>{content}</div>;
    }
  ```
  - add first tool
  ```
    getSpecificAccountBalance: {
      description: `
        Get the balance (could also be referred to as summary) of the accounts owned by a user. 
        The user must specify the name of the types of account or the type of the account itself.
        If the user provides both options do not use the tool twice, just combine the two options.
        If the user asks for all accounts the supported types are checking, savings, credit, investment and other.
      `,
      parameters: z.object({
        type: z.array(z.string()),
        name: z
          .string()
          .optional()
          .describe(
            "Either the name of the account or anything that the users mention to distinguish those accounts, e.g my favorite account",
          ),
      }),
      generate: async function* ({ name, type }) {
        yield <GenericLoader />;

        let accounts = await getAccountsSummary({ name, type });

        return (
          <AccountBalancePieChart
            chartData={Object.entries(accounts).map(
              ([accountType, balance]) => ({
                balance,
                accountType,
              }),
            )}
          />
        );
      },
    }
  ```
  - describe how data is set in tools and how using description and parameters we make the AI smarter to return responses
  - add other tools
  ```
    getPaymentTransactions: {
      description: `
        Get the transactions or payment history of the user, the user might also specify a relative
        date as a starting point. For example it could be the last month or the last year. 
      `,
      parameters: z.object({
        fromDate: z
          .string()
          .optional()
          .describe(
            `The date from which to get the history, formatted as yyyy-MM-dd. The current date is ${format(new Date(), "yyyy-MM-dd")} so relative dates should always 
            start from today and the expected format is 'yyyy-MM-dd', if the user doesnt mention a date default it to last year`,
          ),
      }),
      generate: async function* ({ fromDate }) {
        yield <GenericLoader />;

        let payments = await getPaymentTransactions(fromDate);

        return <PaymentDetails payments={payments} />;
      },
    },
    getStockPrice: {
      description: `Get the stock price for a company`,
      parameters: z.object({
        companySymbol: z
          .string()
          .describe(
            "The symbol of the company if it doesnt exist use the name and find the symbol",
          ),
        fromDate: z
          .string()
          .optional()
          .describe(
            `
            The date from which to get the history, formatted as yyyy-MM-dd. The current date is ${format(new Date(), "yyyy-MM-dd")} 
            so relative dates should always start from today and the expected format is 'yyyy-MM-dd', if the user doesnt mention a date default it to ${format(new Date(), "yyyy-MM-dd")}
            `,
          ),
      }),
      generate: async function* ({ fromDate, companySymbol }) {
        yield <GenericLoader />;
        let history = await getPriceHistory(fromDate);

        return (
          <div>
            Value of {companySymbol} on {fromDate} is{" "}
            {history.at(0)?.value.toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
            })}
          </div>
        );
      },
    },
    getStockPriceHistory: {
      description: `Get the stock price history for a company meaning the price of the company over a period of time`,
      parameters: z.object({
        companyName: z.string().describe("The name of the company"),
        companySymbol: z
          .string()
          .describe(
            "The symbol of the company if it doesnt exist use the name and find the symbol",
          )
          .refine((val) => val.toUpperCase()),
        fromDate: z
          .string()
          .optional()
          .describe(
            `
            The date from which to get the history, formatted as yyyy-MM-dd. The current date is ${format(new Date(), "yyyy-MM-dd")} 
            so relative dates should always 
            start from today and the expected format is 'yyyy-MM-dd', if the user doesnt mention a date default it to last year
            `,
          ),
      }),
      generate: async function* ({ companyName, fromDate }) {
        yield <GenericLoader />;
        let history = await getPriceHistory(fromDate);

        return (
          <div>
            <PriceHistoryChartCard data={history} companyName={companyName} />
          </div>
        );
      },
    },
  ```

  - Create the AI provider with the initial states and allowed actions
  ```
    export const AI = createAI<AIState, UIState>({
      initialAIState: [],
      initialUIState: [
        {
          id: generateId(),
          role: "system",
          display: "Hello, how can I help you?",
        },
      ],
      actions: {
        submitUserMessage,
      },
    });
  ```

- get and update messages for the UI
  ```
    let [messages, setMessages] = useUIState<typeof AI>();
    let { submitUserMessage } = useActions();
  ```

  
- submit the message and await for response before adding the message to the queue
  - what does this do ``` let { submitUserMessage } = useActions(); ```

- add chat screen
  <Chat>
  </Chat>

- add a way to submit the messages
  ```
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();

      let userMessage = (e?.target as any).message.value;

      setMessages((messages: ClientMessage[]) => [
        ...messages,
        { id: generateId(), role: "user", display: userMessage },
      ]);

      let response = await submitUserMessage(userMessage);

      setMessages((messages: ClientMessage[]) => [...messages, response]);
    };
    
    <Chat onUserMessageSubmit={handleSubmit}>
    </Chat>
  ```

- add message box to handle the incoming message
```
  {messages?.map((message: ClientMessage) => (
    <MessageBox key={message.id} from={message.role}>
      {message.display}
    </MessageBox>
  ))}
```

- end with trying to add a new tool to the search if time allows