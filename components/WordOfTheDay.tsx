
import React from 'react';
import { useDictionary } from '../hooks/useDictionary';
import { BookOpen, Volume2 } from './icons';

const handleSpeak = (textToSpeak: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }
};

const WordOfTheDay: React.FC = () => {
  const dictionary = useDictionary();

  if (!dictionary.length) {
    return null;
  }

  // Get a consistent "random" word for the day
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const word = dictionary[dayOfYear % dictionary.length];

  if (!word) {
    return null;
  }
  
  const mainExample = word.examples.find(ex => ex.numee);

  return (
    <section>
        <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center justify-center gap-3">
                <BookOpen className="w-8 h-8 text-cyan-500" />
                Mot du Jour
            </h2>
             <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">Apprenez un nouveau mot chaque jour !</p>
        </div>
        <div className="max-w-2xl mx-auto bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl shadow-xl hover:shadow-cyan-500/20 transition-shadow duration-300 border border-white/20 dark:border-slate-700/50 transform hover:-translate-y-1">
             <div className="flex justify-between items-start">
                <div className="flex items-baseline gap-3">
                    <h3 className="text-4xl font-bold text-cyan-600 dark:text-cyan-400">{word.numee}</h3>
                    {word.phonetic && <span className="text-xl text-slate-500 dark:text-slate-400 font-mono">[{word.phonetic}]</span>}
                </div>
                <span className="italic text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-700/70 px-3 py-1 rounded-full text-sm font-medium">{word.type}</span>
            </div>
            
            <p className="text-2xl text-slate-700 dark:text-slate-300 mt-1">{word.french}</p>
            {word.definition && <p className="mt-2 text-slate-600 dark:text-slate-400">{word.definition}</p>}

            <div className="mt-3 space-y-1 text-sm text-slate-500 dark:text-slate-400">
                {word.variants && <div><span className="font-semibold">Variantes:</span> <span className="italic">{word.variants}</span></div>}
                {word.literal && <div><span className="font-semibold">Trad. litt.:</span> <span className="italic">{word.literal}</span></div>}
            </div>

            {mainExample && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-md text-slate-600 dark:text-slate-400">Exemple d'utilisation :</p>
                <blockquote className="mt-2 pl-4 border-l-4 border-cyan-500">
                    <p className="italic text-lg text-slate-600 dark:text-slate-300">"{mainExample.numee}"</p>
                    <p className="italic text-md text-slate-500 dark:text-slate-400">"{mainExample.french}"</p>
                </blockquote>
            </div>
            )}

            <div className="mt-6 flex justify-end">
                <button 
                    onClick={() => handleSpeak(word.numee)}
                    className="text-slate-400 hover:text-cyan-500 transition-colors p-2 rounded-full hover:bg-cyan-100/50 dark:hover:bg-slate-700/50" 
                    title="Écouter la prononciation"
                    aria-label={`Écouter la prononciation du mot ${word.numee}`}
                >
                    <Volume2 className="w-7 h-7" />
                </button>
            </div>
        </div>
    </section>
  );
};

export default WordOfTheDay;