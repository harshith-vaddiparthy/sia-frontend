import leoProfanity from 'leo-profanity';

export const useProfanityFilter = () => {
    const filterProfanity = (text) => {
        return leoProfanity.clean(text);
    };

    return { filterProfanity };
};
