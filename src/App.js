import { useEffect, useRef, useState } from 'react'
import tw, { styled } from 'twin.macro'
import { ReactComponent as Airplane } from './assets/svg/airplane.svg'
import useOpenAI from './useOpenAI'
import LoadingGif from './assets/loading.gif'

export default function App() {
  const { loading, error, feed, generate } = useOpenAI()

  return (
    <Wrapper>
      <Header>TimGPT</Header>
      <Feed feed={feed} loading={loading} error={error} />
      <MessageForm generate={generate} />
    </Wrapper>
  )
}

const Wrapper = tw.div`relative h-screen w-screen flex flex-col`

// Header
const Header = tw.header`h-24 w-full bg-white shadow flex items-center justify-center text-2xl`

// Chat Feed
/**
 *
 * @param {Object} props
 * @param {import('./useOpenAI').Response[]} props.feed
 * @param {boolean} props.loading
 * @param {string | null} props.error
 * @returns
 */
const Feed = ({ feed, loading, error }) => {
  //Auto scroll to bottom
  const scrollRef = useRef()

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [feed, loading])

  return (
    <FeedWrapper>
      {feed?.map(({ role, content }, index) => {
        const isHuman = role === 'user'
        const isLastMessage = !loading && !error && index === feed.length - 1

        return (
          <Message
            ref={isLastMessage ? scrollRef : undefined}
            blueMsg={isHuman}
          >
            {content}
          </Message>
        )
      })}
      {loading && <Gif ref={scrollRef} src={LoadingGif} alt='loading' />}
      {error && <Message>{error}</Message>}
    </FeedWrapper>
  )
}

const FeedWrapper = tw.div`flex-1 overflow-y-auto px-4 py-2 max-h-[calc(100vh - 96px - 48px)] flex flex-col gap-4`
const Message = styled.div(({ blueMsg }) => [
  tw` p-3 rounded-t-2xl  w-fit max-w-[80%]`,
  blueMsg
    ? tw`bg-blue-500 text-white rounded-l-2xl ml-auto`
    : tw`bg-neutral-300 text-neutral-800 rounded-r-2xl`,
])
const Gif = tw.img`h-12 w-[4.5rem]`

// Message Form
/**
 *
 * @param {Object} props
 * @param {(prompt: string) => Promise<void>} props.generate
 */
const MessageForm = ({ generate }) => {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    generate(message)
    setMessage('')
  }

  const handleEnter = e => e.key === 'Enter' && handleSend()

  return (
    <MessageBox>
      <Input
        placeholder='Message...'
        value={message}
        onKeyDown={handleEnter}
        onChange={e => setMessage(e.target.value)}
      />
      <SendButton onClick={handleSend}>
        <Airplane />
      </SendButton>
    </MessageBox>
  )
}

const MessageBox = tw.div`bg-white py-1 px-2 border-t border-neutral-400/20 flex gap-4 absolute bottom-0 w-full h-12`
const Input = tw.input`w-full h-full bg-transparent border p-2 rounded-full border-neutral-300 outline-none`
const SendButton = tw.button`bg-blue-500 text-white rounded-full [svg]:(w-5 h-5 stroke-2 text-white) p-2`
