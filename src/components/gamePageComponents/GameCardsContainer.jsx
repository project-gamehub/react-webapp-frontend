import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGamesData } from "../../config/gamesDataSlice";
import GameCard from "./GameCard";
import GameCardLoader from "./GameCardLoader";
import "../../styles/gamePageStyles/gameCardContainer.css";

const GameCardsContainer = () => {
    const { gamesData, gamesDataError, gamesDataLoading } = useSelector(
        (state) => state.gamesDataSlice
    );
    const dispatch = useDispatch();

    useEffect(() => {
        if (!gamesData) {
            dispatch(fetchGamesData());
        }
    }, [dispatch, gamesData]);

    return (
        <>
            <div className="game-cards-container">
                {gamesDataLoading ? (
                    <>
                        <GameCardLoader />
                        <GameCardLoader />
                        <GameCardLoader />
                        <GameCardLoader />
                    </>
                ) : gamesDataError ? (
                    "Error while getting games"
                ) : (
                    gamesData.map((games) => (
                        <GameCard data={games} key={games._id} />
                    ))
                )}
            </div>
        </>
    );
};

export default GameCardsContainer;
