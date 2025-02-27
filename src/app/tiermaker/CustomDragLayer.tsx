import { useDragLayer } from 'react-dnd';
import { Character, Weapon, ItemTypes } from './types';
import React from 'react';

interface CustomDragLayerProps {
  characters: Character[];
  weapons: Weapon[];
}

const CustomDragLayer: React.FC<CustomDragLayerProps> = ({ characters, weapons }) => {
  // useDragLayerでドラッグ情報を取得
  const { isDragging, item, currentOffset, itemType } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  // デバッグ情報
  console.log('Drag state:', { isDragging, item, currentOffset, itemType });
  
  // ドラッグしていない場合は何も表示しない
  if (!isDragging || !currentOffset) {
    return null;
  }

  // ドラッグアイテムを探す
  let imageUrl = '';
  let name = '';
  
  if (itemType === ItemTypes.CHARACTER) {
    const character = characters.find(c => c.id === item.id);
    if (character) {
      imageUrl = character.iconUrl;
      name = character.name;
    }
  } else if (itemType === ItemTypes.WEAPON) {
    const weapon = weapons.find(w => w.id === item.id);
    if (weapon) {
      imageUrl = weapon.iconUrl;
      name = weapon.name;
    }
  }
  
  // 画像が見つからない場合
  if (!imageUrl) {
    console.error('Could not find image for item:', item);
    return null;
  }

  // プレビュー表示位置の計算
  const { x, y } = currentOffset;

  // スタイル定義
  const layerStyles: React.CSSProperties = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 9999,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  };

  const itemStyles: React.CSSProperties = {
    transform: `translate(${x}px, ${y}px)`,
    WebkitTransform: `translate(${x}px, ${y}px)`,
    position: 'absolute',
    left: 0,
    top: 0
  };

  return (
    <div style={layerStyles}>
      <div style={itemStyles}>
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-4 border-amber-400 shadow-lg bg-white/90 backdrop-blur-sm">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Failed to load image:', imageUrl);
              (e.target as HTMLImageElement).src = '/images/placeholder.png';
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default CustomDragLayer; 
