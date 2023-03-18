import { useState } from 'react'
import openai from './openAIConfig'

/**
 *
 * @typedef {Object} Response
 * @property {string} role
 * @property {string} content
 *
 *
 * @returns {{
 * loading: boolean,
 * error: string,
 * feed: Response[],
 * generate: (prompt: string) => Promise<void>
 * }}
 */
export default function useOpenAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [feed, setFeed] = useState([])

  const generate = async prompt => {
    const timeout = setTimeout(() => setLoading(true), 500)
    setError(null)

    try {
      const newFeed = [...feed, { role: 'user', content: prompt }]
      setFeed(newFeed)
      const res = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Who won the world series in 2020?' },
          {
            role: 'assistant',
            content: 'The Los Angeles Dodgers won the World Series in 2020.',
          },
          ...newFeed,
        ],
      })

      const response = res.data.choices[0].message
      setFeed(curr => [...curr, response])

      clearTimeout(timeout)
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    feed,
    generate,
  }
}
