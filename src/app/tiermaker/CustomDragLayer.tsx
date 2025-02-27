import { useDragLayer } from 'react-dnd';
import { Character, Weapon, ItemTypes } from './types';
import React from 'react';
import Image from 'next/image';

interface CustomDragLayerProps {
  characters: Character[];
  weapons: Weapon[];
}

const CustomDragLayer: React.FC<CustomDragLayerProps> = ({ characters, weapons }) => {
  const { isDragging, item, initialOffset, currentOffset, itemType } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  // デバッグ情報を出力
  console.log('DragLayer:', { isDragging, itemType, item, currentOffset });

  if (!isDragging || !currentOffset) {
    return null;
  }

  // ドラッグするアイテムの情報を取得
  let content = null;

  if (itemType === ItemTypes.CHARACTER) {
    const character = characters.find(c => c.id === item.id);
    if (character) {
      content = (
        <div className="pointer-events-none w-16 h-16 rounded-lg overflow-hidden border-4 border-amber-400 bg-white shadow-xl">
          <img 
            src={character.iconUrl} 
            alt={character.name} 
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
  } else if (itemType === ItemTypes.WEAPON) {
    const weapon = weapons.find(w => w.id === item.id);
    if (weapon) {
      content = (
        <div className="pointer-events-none w-16 h-16 rounded-lg overflow-hidden border-4 border-amber-400 bg-white shadow-xl">
          <img 
            src={weapon.iconUrl} 
            alt={weapon.name} 
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
  }

  if (!content) {
    return null;
  }

  const style: React.CSSProperties = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 9999,
    left: currentOffset.x,
    top: currentOffset.y,
    transform: 'translate(-50%, -50%)'
  };

  return (
    <div style={style}>
      {content}
    </div>
  );
};

export default CustomDragLayer; 
