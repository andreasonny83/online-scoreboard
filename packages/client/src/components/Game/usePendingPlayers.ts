import { useState, useEffect, useCallback } from 'react';
import { GameUserData } from './Game.types';

export const usePendingPlayers = (pendingPlayers: GameUserData[] = [], users: GameUserData[], userId: string) => {
  const [pendingPlayer, setPendingPlayer] = useState({ id: '', name: '' });
  const [dismissedPendingPlayers, setDismissedPendingPlayers] = useState<string[]>([]);

  const getNextPendingPlayer = useCallback(() => {
    return pendingPlayers.find(currPendingPlayer => !~dismissedPendingPlayers.indexOf(currPendingPlayer.id));
  }, [dismissedPendingPlayers, pendingPlayers]);

  const isAcceptedUser = useCallback(() => {
    return Boolean(users.find(currUser => currUser && currUser.id === userId));
  }, [userId, users]);

  const isPendingUser = useCallback(() => {
    const isPending = pendingPlayers.find(currPendingPlayer => currPendingPlayer.id === userId);

    return Boolean(isPending);
  }, [pendingPlayers, userId]);

  useEffect(() => {
    if (pendingPlayers) {
      if (
        pendingPlayer.id &&
        pendingPlayers &&
        !pendingPlayers.find(currPendingPlayer => currPendingPlayer.id === pendingPlayer.id)
      ) {
        setPendingPlayer({ id: '', name: '' });
      }
    } else {
      setPendingPlayer({ id: '', name: '' });
    }
  }, [pendingPlayer.id, pendingPlayers]);

  useEffect(() => {
    const nextPendingPlayer = getNextPendingPlayer();
    if (isAcceptedUser() && pendingPlayers.length) {
      if (nextPendingPlayer) {
        const { id, item } = nextPendingPlayer;
        if (item && item.username) {
          setPendingPlayer({
            id,
            name: item.username,
          });
        } else {
          setDismissedPendingPlayers([...dismissedPendingPlayers, nextPendingPlayer.id]);
        }
      } else if (pendingPlayer.id) {
        setPendingPlayer({ id: '', name: '' });
      }
    }
  }, [dismissedPendingPlayers, getNextPendingPlayer, isAcceptedUser, pendingPlayer.id, pendingPlayers.length]);

  return {
    dismissPendingPlayer: setDismissedPendingPlayers,
    pendingPlayer,
    dismissedPendingPlayers,
    isAcceptedUser,
    isPendingUser,
  };
};