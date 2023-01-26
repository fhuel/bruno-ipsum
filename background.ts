import { Storage } from "@plasmohq/storage"

const storage = new Storage()
// export {} // This is intercepted automatically by Plasmo packager

// const getKey = () => {}

// Setup our generate function
const generate = async (prompt) => {
  const apiKey = await storage.get("apiKey")
  // Get your API key from storage
  const key = apiKey
  const url = "https://api.openai.com/v1/completions"

  // Call completions endpoint
  const completionResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 1250,
      temperature: 0.7
    })
  })

  // Select the top choice and send back
  const completion = await completionResponse.json()
  return completion.choices.pop()
}

const generateCompletionAction = async (info) => {
  try {
    // Send mesage with generating text (this will be like a loading indicator)
    sendMessage("generating...")

    const { selectionText } = info
    const basePromptPrefix = `
    Scrivimi, senza numberazione, senza virgolette e senza citare l'autore, una citazioni di Bruno munari lunga cinque paragrafi sull'argomento. In modo che possa essere usato come un sostituto di un Lorem Ipsum.

    Argomento:
    `

    // Add this to call GPT-3
    const baseCompletion = await generate(`${basePromptPrefix}${selectionText}`)

    // // Add your second prompt here
    // const secondPrompt = `
    //   Take the table of contents and title of the blog post below and generate a twitter thread, with numbered tweets in the style of David Attenborough. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.

    //   Title: ${selectionText}

    //   Table of Contents: ${baseCompletion.text}

    //   Blog Post:
    //   `

    // // Call your second prompt
    // const secondPromptCompletion = await generate(secondPrompt)

    // // Send the output when we're all done
    // sendMessage(secondPromptCompletion.text)
    sendMessage(baseCompletion.text)
  } catch (error) {
    console.log(error)
    // Add this here as well to see if we run into any errors!
    sendMessage(error.toString())
  }
}

const sendMessage = (content) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id

    chrome.tabs.sendMessage(
      activeTab,
      { message: "inject", content },
      (response) => {
        if (response.status === "failed") {
          console.log("injection failed.")
        }
      }
    )
  })
}

chrome.runtime.onInstalled.addListener(() => {
  // console.log("Installed")
  chrome.contextMenus.create({
    id: "GIPPI",
    title: "Generate",
    contexts: ["selection"]
  })
})

// Add Listener
chrome.contextMenus.onClicked.addListener(generateCompletionAction)
