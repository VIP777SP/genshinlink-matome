import { useDragLayer } from 'react-dnd';
import { Character, Weapon, ItemTypes } from './types';

interface CustomDragLayerProps {
  characters: Character[];
  weapons: Weapon[];
}

const CustomDragLayer = ({ characters, weapons }: CustomDragLayerProps) => {
  const { isDragging, item, initialOffset, currentOffset, itemType } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  // ドラッグされていない場合は何も表示しない
  if (!isDragging || !currentOffset) {
    return null;
  }

  // ドラッグされているアイテムのスタイルを計算
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;

  // ドラッグ中のアイテムを取得
  const getItemPreview = () => {
    // キャラクターの場合
    if (itemType === ItemTypes.CHARACTER) {
      const character = characters.find(char => char.id === item.id);
      if (!character) return null;

      return (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-amber-200 shadow-md">
          <img src={character.iconUrl} alt={character.name} className="w-full h-full object-cover" />
        </div>
      );
    }
    // 武器の場合
    else if (itemType === ItemTypes.WEAPON) {
      const weapon = weapons.find(w => w.id === item.id);
      if (!weapon) return null;

      return (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-amber-200 shadow-md">
          <img src={weapon.iconUrl} alt={weapon.name} className="w-full h-full object-cover" />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed pointer-events-none z-50 left-0 top-0" style={{ transform }}>
      {getItemPreview()}
    </div>
  );
};

export default CustomDragLayer; 
