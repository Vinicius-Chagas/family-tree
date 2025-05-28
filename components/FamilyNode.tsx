import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ExtNode } from 'relatives-tree/lib/types';
import { FONT_SIZE, NODE_PADDING, SIZE, X } from '../constants/consts';

interface FamilyNodeProps {
  node: ExtNode;
  style?: any;
  isRoot?: boolean; // Optional prop to indicate if the node is a root
}

const FamilyNode: React.FC<FamilyNodeProps> = ({ node, style, isRoot }) => {
  const color = node.gender === 'male' ? '#eee' : '#fff';
  const scalledPadding = NODE_PADDING * 2.5;
  return (
    <View
      style={[
        styles.nodeContainer,
        {
          left: node.left * X + scalledPadding,
          top: node.top * X + scalledPadding,
          width: SIZE * X - scalledPadding * 2,
          height: SIZE * X - scalledPadding * 2,
          backgroundColor: color,
          borderWidth: isRoot ? 2 : 1,
        },
        style,
      ]}
    >
      <Text style={styles.textStyle} numberOfLines={1} ellipsizeMode="tail">
        {node.id}
      </Text>
      {node.hasSubTree && (
        <View style={styles.dotStyle} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  nodeContainer: {
    position: 'absolute',
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4, // To match the visual of a rounded rectangle if desired
  },
  textStyle: {
    fontSize: FONT_SIZE,
    textAlign: 'center',
    color: '#000', // Ensure text is visible
  },
  dotStyle: {
    position: 'absolute',
    width: 8, // Diameter of 8px (radius 4px like in canvas)
    height: 8,
    borderRadius: 4, // Make it a circle
    backgroundColor: '#000',
    top: 2, // Small offset from the top edge of the node container
    right: 2, // Small offset from the right edge of the node container
  },
});

export default FamilyNode;