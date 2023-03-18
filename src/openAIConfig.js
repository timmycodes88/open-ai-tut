import { Configuration, OpenAIApi } from 'openai'

const config = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
})

const openai = new OpenAIApi(config)

export default openai
