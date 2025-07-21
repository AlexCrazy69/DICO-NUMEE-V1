
import React, { useState, useMemo, useEffect } from 'react';
import { useDictionary } from '../hooks/useDictionary';
import { DictionaryEntry, View } from '../types';
import { Search, Volume2, BookOpen } from './icons';
import AlphabetNav from './AlphabetNav';

const handleSpeak = (textToSpeak: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Annule la lecture précédente si elle existe
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Désolé, la synthèse vocale n'est pas supportée par votre navigateur.");
  }
};

const InfoTag: React.FC<{ label: string; value: string; isClickable?: boolean; onClick?: (value: string) => void }> = ({ label, value, isClickable, onClick }) => {
    if (!value) return null;
    const cleanValue = value.replace(/[{()}]/g, '');
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onClick) {
            onClick(cleanValue);
        }
    };
    return (
      <div className="text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold">{label}:</span>{' '}
        {isClickable && onClick ? (
          <button onClick={handleClick} className="italic hover:underline text-cyan-600 dark:text-cyan-400 text-left">{cleanValue}</button>
        ) : (
          <span className="italic">{cleanValue}</span>
        )}
      </div>
    );
};


const DictionaryCard: React.FC<{ entry: DictionaryEntry; onSearch: (term: string) => void; }> = ({ entry, onSearch }) => (
  <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 border border-white/30 dark:border-slate-700/50 transform hover:-translate-y-1 flex flex-col">
    <div className="flex-grow">
        <div className="flex justify-between items-start gap-2">
            <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{entry.numee}</h3>
                {entry.phonetic && <span className="text-slate-500 dark:text-slate-400 font-mono">[{entry.phonetic}]</span>}
            </div>
            {entry.type && <span className="italic text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-xs whitespace-nowrap">{entry.type}</span>}
        </div>

        <p className="text-lg text-slate-700 dark:text-slate-300 mt-1">{entry.french}</p>
        {entry.definition && <p className="mt-2 text-slate-600 dark:text-slate-400">{entry.definition}</p>}
        
        <div className="mt-3 space-y-1">
            {entry.literal && <InfoTag label="Trad. litt." value={entry.literal} />}
            {entry.variants && <InfoTag label="Variantes" value={entry.variants} />}
            {entry.homonym && <InfoTag label="Homonyme" value={entry.homonym} />}
            {entry.crossReference && <InfoTag label="Voir aussi" value={entry.crossReference} isClickable onClick={onSearch} />}
        </div>


        {entry.examples && entry.examples.length > 0 && entry.examples[0].numee && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
              <p className="font-semibold text-sm text-slate-600 dark:text-slate-400">Exemple{entry.examples.length > 1 ? 's' : ''} :</p>
              {entry.examples.map((ex, index) => (
                  <div key={index}>
                      <p className="italic text-slate-600 dark:text-slate-300">"{ex.numee}"</p>
                      <p className="italic text-slate-500 dark:text-slate-400 text-sm">"{ex.french}"</p>
                  </div>
              ))}
          </div>
        )}
    </div>
    <div className="mt-4 flex justify-end">
        <button 
            onClick={() => handleSpeak(entry.numee)}
            className="text-slate-400 hover:text-cyan-500 transition-colors" 
            title="Écouter la prononciation"
            aria-label={`Écouter la prononciation du mot ${entry.numee}`}
        >
            <Volume2 />
        </button>
    </div>
  </div>
);

const normalizeString = (str: string) => 
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

interface DictionaryProps {
    setView: (view: View, letter?: string) => void;
    initialLetter: string;
}
    
const Dictionary: React.FC<DictionaryProps> = ({ setView, initialLetter }) => {
  const dictionary = useDictionary();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLetter, setActiveLetter] = useState('');

  useEffect(() => {
    if (initialLetter) {
      setActiveLetter(initialLetter);
      setSearchTerm('');
    }
  }, [initialLetter]);

  const filteredDictionary = useMemo(() => {
    if (activeLetter) {
      return dictionary.filter(entry => 
        normalizeString(entry.numee).startsWith(activeLetter.toLowerCase())
      );
    }
    if (searchTerm) {
      const normalizedSearchTerm = normalizeString(searchTerm);
      return dictionary.filter(
        (entry) =>
          normalizeString(entry.numee).includes(normalizedSearchTerm) ||
          normalizeString(entry.french).includes(normalizedSearchTerm) ||
          (entry.definition && normalizeString(entry.definition).includes(normalizedSearchTerm)) ||
          (entry.variants && normalizeString(entry.variants).includes(normalizedSearchTerm)) ||
          (entry.literal && normalizeString(entry.literal).includes(normalizedSearchTerm))
      );
    }
    return [];
  }, [searchTerm, dictionary, activeLetter]);
  
  const handleLetterClick = (letter: string) => {
    if (letter === activeLetter) {
      setActiveLetter(''); 
    } else {
      setActiveLetter(letter);
      setSearchTerm('');
    }
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setActiveLetter('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  }

  const hasContentToShow = searchTerm || activeLetter;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Dictionnaire Numèè</h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">Explorez {dictionary.length} mots et expressions.</p>
      </div>

      <div className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg space-y-4">
        <AlphabetNav onLetterClick={handleLetterClick} activeLetter={activeLetter} />
        <div className="relative">
            <input
            type="text"
            placeholder="Ou recherchez un mot (français ou numèè)..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-2 border-slate-300 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            aria-label="Rechercher dans le dictionnaire"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search />
            </div>
        </div>
      </div>
      
      {hasContentToShow && (
        <p className="text-center text-slate-500 dark:text-slate-400 -mt-4">
            {filteredDictionary.length} résultat{filteredDictionary.length !== 1 ? 's' : ''}
            {activeLetter ? ` pour la lettre '${activeLetter}'` : ''}
            {searchTerm ? ` pour "${searchTerm}"` : ''}
        </p>
      )}

      {hasContentToShow ? (
        filteredDictionary.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDictionary.map((entry, index) => (
                  <DictionaryCard key={`${entry.numee}-${index}`} entry={entry} onSearch={handleSearch} />
              ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg">
              <BookOpen className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
              <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">Aucun mot trouvé</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Veuillez vérifier l'orthographe ou essayer une autre recherche.</p>
          </div>
        )
      ) : (
        <div className="text-center py-16 px-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg">
            <BookOpen className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
            <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">Commencez votre exploration</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Sélectionnez une lettre de l'abécédaire ou utilisez la barre de recherche pour trouver un mot.</p>
        </div>
      )}
    </div>
  );
};

export default Dictionary;