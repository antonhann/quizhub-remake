// import { useLocation, useNavigate, useParams } from 'react-router';
// import { useSessionContext } from '../../SessionContext';
import { useEffect, useRef, useState } from 'react';
import { StudyCard } from '../../models/StudyCard';
import { ToggleButton } from '../reusables/ToggleButton';
import { useLocation } from 'react-router';

export const Flashcard = () => {
    // const params = useParams();
    // const session = useSessionContext();
    // const navigate = useNavigate()
    const location = useLocation();
    const formRef = useRef<HTMLDivElement  | null>(null);
    
    const [terms, setTerms] = useState<StudyCard[]>(location.state.originalStudySet.terms)
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [showingTerm, setShowingTerm] = useState<boolean>(true)
    const [shuffled, setShuffled] = useState<boolean>(false)
    const [smartSort, setSmartSort] = useState<boolean>(false)
    const [knowTerms, setKnowTerms] = useState<number>(0)
    const [startsWithTerm, setStartsWithTerm] = useState<boolean>(true)
    const [optionPopUp, setOptionsPopUp] = useState<boolean>(false)

    useEffect(() => {
        console.log(terms)
    },[currentIndex])
    const handleNextCard = (inc : number) => {
        let newIndex = inc + currentIndex
        if (newIndex < 0){
            return
        }
        setCurrentIndex(newIndex)
    }
    const handleRestartClick = () => {
        setCurrentIndex(0)
        setKnowTerms(0)
        let ogTerms = location.state.originalStudySet.terms
        ogTerms.forEach((item : StudyCard) => {
            item.knows = false; // Mutate each item directly
        });
        setTerms(location.state.originalStudySet.terms)
    }
    const toggleShuffle = () => {
        let newShuffled = !shuffled
        setShuffled(newShuffled)
        if (newShuffled){
            const doneStudySet = terms.slice(0,currentIndex)
            const remainingStudySet = terms.slice(currentIndex)
            shuffle(remainingStudySet)
            setTerms(doneStudySet.concat(remainingStudySet))
        }else{
            const doneSet = terms.slice(0,currentIndex)
            //sorts the remaining terms by id in ascending order
            const remainingSet = terms.slice(currentIndex).sort((a,b) => a.id - b.id)
            setTerms(doneSet.concat(remainingSet))
        }
    }
    const handleIDKCard = () => {
        terms[currentIndex].knows = false
        setKnowTerms(knowTerms - 1)
        handleNextCard(1)
    }
    const handleKnowsCard = () => {
        terms[currentIndex].knows = true
        setKnowTerms(knowTerms + 1)
        handleNextCard(1)
    }
    const handleReviewUnknownTermsClick = () => {
        setKnowTerms(0)
        const unknownSet = terms.filter((item) => {
            return item.knows === false
        })
        if(unknownSet.length === 0){
            
        }else{
            setTerms(unknownSet)
            setCurrentIndex(0)
        }
    }
    const handleClickOutsideForm = (event : any) => {
        /**if click is outside of the div close form */
        if (formRef && formRef.current && !formRef.current.contains(event.target)) {
            setOptionsPopUp(false);
        }
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutsideForm);
        // Cleanup the event listener on component unmount
        return () => {
          document.removeEventListener("mousedown", handleClickOutsideForm);
        };
      }, [formRef]);

    if(currentIndex == terms.length){
        return(
            <div>
                <div>
                    {smartSort &&
                    ((knowTerms !== terms.length) ?
                    <button onClick={() => handleReviewUnknownTermsClick()}>Review Unknown Terms</button>
                    :
                    <div>Finished!</div>
                    )
                    }
                </div>
                <div>
                    <button onClick={() => handleRestartClick()}>Restart</button>
                </div>
            </div>
        )
    }
    return (
        <div>
            <div onClick={() => setShowingTerm(!showingTerm)}>
                <p>{currentIndex + 1} / {terms.length}</p>
                {
                    showingTerm?
                    (
                        <div>
                            {terms[currentIndex].term}
                        </div>
                    )
                    :
                    (
                        <div>
                            {terms[currentIndex].answer}
                        </div>
                    )
                }
            </div>
            <div>
                {
                    smartSort ?
                    <div>

                        <button onClick={() => handleIDKCard()}>IDK</button>
                        <button onClick={() => handleKnowsCard()}>Know</button>
                    </div>
                    :
                    <div>
                        <button onClick={() => handleNextCard(-1)}>Prev</button>
                        <button onClick={() => handleNextCard(1)}>Next</button>
                    </div>
                }
            </div>
            <div>
                <button className = "" onClick={() => setOptionsPopUp(!optionPopUp)}>Options</button>
            </div>
            {optionPopUp && (
                <div className = "flashcardOptionsPopup">
                    <div ref = {formRef} className='flashcardOptionInner'>
                        <div className='flashcardOptionHeading'>
                            <h2>Options!</h2>
                            <button className = "closeButton" onClick={() => setOptionsPopUp(!optionPopUp)}>Close</button>
                        </div>
                        <div className='toggleButtons'>
                            <ToggleButton
                                toggleFunction = {() => toggleShuffle()}
                                label = "Shuffle"
                                check = {shuffled}
                            />
                            <ToggleButton
                                toggleFunction = {() => setSmartSort(!smartSort)}
                                label = "Smart Sort"
                                check = {smartSort}
                            />
                            <ToggleButton
                                toggleFunction = {() => setStartsWithTerm(!startsWithTerm)}
                                label = "Start with Term"
                                check = {startsWithTerm}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function shuffle(array : StudyCard[]) {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }
export default Flashcard
