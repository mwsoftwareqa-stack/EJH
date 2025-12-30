import { RoomOccupation } from '../contexts/domain/roomOccupation';
import { GuestsContext } from '../contexts/guestsContext';

export function create2AdultsContext(): GuestsContext {
  return buildGuestsContext([
    { adults: 2, children: 0, infants: 0 }
  ]);
}

export function creat1Adult2ChildrenContext(): GuestsContext {
  return buildGuestsContext([
    { adults: 1, children: 2, infants: 0, childrenAges: [4, 9] }
  ]);
}

export function creat1Adult1InfantContext(): GuestsContext {
  return buildGuestsContext([
    { adults: 1, children: 0, infants: 1 }
  ]);
}

export function create4Adults3Children1Infant3RoomsContext(): GuestsContext {
  return buildGuestsContext([
    { adults: 2, children: 2, infants: 0, childrenAges: [5, 13] },
    { adults: 1, children: 0, infants: 1 },
    { adults: 1, children: 1, infants: 0, childrenAges: [11] }
  ]);
}

export function createGuestsContextCustom(
  roomDefinitions: { adults: number; children: number; infants: number; childrenAges?: number[] }[],
  language: string = 'English'
): GuestsContext {
  return buildGuestsContext(roomDefinitions, language);
}

function buildGuestsContext(
  roomDefinitions: { adults: number; children: number; infants: number; childrenAges?: number[] }[],
  language: string = 'English'
): GuestsContext {
  const guestsContext = new GuestsContext();

  for (const def of roomDefinitions) {
    const room = new RoomOccupation();
    room.adults = def.adults;
    room.children = def.children;
    room.infants = def.infants;

    if (def.childrenAges) {
      room.childrenAges = def.childrenAges;
    }

    guestsContext.rooms.push(room);
  }

  guestsContext.populateGuestsData(language);
  return guestsContext;
}
