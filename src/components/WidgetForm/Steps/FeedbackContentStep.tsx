import { FormEvent, useState } from 'react'
import { ArrowLeft } from "phosphor-react";
import { FeedbackType, feedbackTypes } from "..";
import { CloseButton } from "../../CloseButton";
import { ScreenshotButton } from "../ScreenshotButton";
import { api } from '../../../lib/api';
import { Loading } from '../../Loading';


interface FeedbackContentProps {
    feedbackType: FeedbackType;
    onFeedbackRestartRequested: () => void;
    onFeedbackSent: () => void;
}

export function FeedbackContentStep({
    feedbackType,
    onFeedbackRestartRequested,
    onFeedbackSent }: FeedbackContentProps) {

    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [comment, setComment] = useState('');
    const [isSendingFeedback, setIsSendingFeedback] = useState(false);

    const feedbackTypeInfo = feedbackTypes[feedbackType];

    async function handleSubmitFeedback(event: FormEvent) {
        event.preventDefault();

        setIsSendingFeedback(true);
        await api.post('/feedbacks', {
            type: feedbackType,
            comment,
            screenshot: screenshot
        })
        setIsSendingFeedback(false);
        onFeedbackSent();
    }

    return (
        <>
            <header>
                <button
                    type="button"
                    className="top-5 left-5 absolute text-zinc-400 hover:text-zinc-100"
                    onClick={() => onFeedbackRestartRequested()}
                >
                    <ArrowLeft weight="bold" className="w-4 h-4" />
                </button>
                <span className="text-xl leading-6 flex items-center gap-2">
                    <img
                        src={feedbackTypeInfo.image.source}
                        alt={feedbackTypeInfo.image.alt}
                        className="w-6 h-6"
                    ></img>
                    {feedbackTypeInfo.title}
                </span>
                <CloseButton />
            </header>
            <form
                onSubmit={handleSubmitFeedback}
                className="my-4 w-full">
                <textarea
                    onChange={event => setComment(event.target.value)}
                    className=" min-w-[304px] w-full min-h-[112px] text-sm placeholder-zinc-400 text-zinc-100 border-2 border-transparent focus:border-brand-500 focus:outline-none border-zinc-600 bg-transparent rounded-md 
                    focus:border-brand-400 focus:ring-brand-500 focus:ring-1 resize-none scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thin"
                    placeholder="Conte com detalhes o que está acontecendo..."
                >

                </textarea>
                <footer className="flex gap2 mt-2">
                    <ScreenshotButton
                        screenshot={screenshot}
                        onScreenshotTook={setScreenshot}
                    />
                    <button
                        disabled={comment.length === 0 || isSendingFeedback}
                        type="submit"
                        className="p-2 bg-brand-500 rounded-md border-transparent flex-1 flex justify-center items-center text-sm hover:bg-brand-300 focus-outline-none focus:ring-2 focus-ring-offset-2 focus:ring-offset-zinc-900 focus-ring-brand-500 transition-colors disabled:opacity-50 disabled:bg-brand-500"
                    >{isSendingFeedback
                        ? <Loading /> : 'Enviar Feedback'

                        }</button>
                </footer>
            </form>

        </>
    );
}