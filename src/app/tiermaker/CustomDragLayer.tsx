import { useDragLayer } from 'react-dnd';
import { Character, Weapon, ItemTypes } from './types';

interface CustomDragLayerProps {
  characters: Character[];
  weapons: Weapon[];
}

const CustomDragLayer = ({ characters, weapons }: CustomDragLayerProps) => {
  const { isDragging, item, currentOffset, itemType } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  // デバッグ情報をコンソールに出力
  console.log('CustomDragLayer:', { isDragging, item, currentOffset, itemType });
  console.log('ItemTypes:', ItemTypes);
  
  // ドラッグされていない場合は何も表示しない
  if (!isDragging || !currentOffset) {
    return null;
  }

  // ドラッグされているアイテムのスタイルを計算
  const { x, y } = currentOffset;
  
  // ドラッグ中のアイテムを取得
  const getItemPreview = () => {
    // キャラクターの場合
    if (itemType === ItemTypes.CHARACTER) {
      const character = characters.find(char => char.id === item.id);
      if (!character) {
        console.log('Character not found:', item.id);
        return null;
      }
      console.log('Rendering character preview:', character);

      return (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-amber-200 shadow-md bg-white">
          <img src={character.iconUrl} alt={character.name} className="w-full h-full object-cover" />
        </div>
      );
    }
    // 武器の場合
    else if (itemType === ItemTypes.WEAPON) {
      const weapon = weapons.find(w => w.id === item.id);
      if (!weapon) {
        console.log('Weapon not found:', item.id);
        return null;
      }
      console.log('Rendering weapon preview:', weapon);

      return (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-amber-200 shadow-md bg-white">
          <img src={weapon.iconUrl} alt={weapon.name} className="w-full h-full object-cover" />
        </div>
      );
    }
    
    console.log('Unknown item type:', itemType);
    return null;
  };

  const layerStyles: React.CSSProperties = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 9999,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  };

  const getItemStyles = (initialOffset: { x: number, y: number }) => {
    const transform = `translate(${initialOffset.x}px, ${initialOffset.y}px)`;
    return {
      transform,
      WebkitTransform: transform
    };
  };

  return (
    <div style={layerStyles}>
      <div style={getItemStyles({ x, y })}>
        {getItemPreview()}
      </div>
    </div>
  );
};

export default CustomDragLayer; 
