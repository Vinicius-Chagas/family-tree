import FamilyNode from '@/components/FamilyNode';
import ReactFamilyTree from '@/components/familyTree';
import { nodes } from '@/hooks/nodes';
import 'expo-router/entry';
import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export default function Index() {
  const WIDTH = 100;
  const HEIGHT = 100;

  return (
    <GestureHandlerRootView style={{ flex:1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{width: 350, height: 400, borderWidth: 1, borderColor: 'black'}}>
        <ReactFamilyTree
          nodes={nodes}
          rootId={nodes[0].id}
          width={WIDTH}
          height={HEIGHT}
          renderNode={(node) => (
              <FamilyNode
                key={node.id}
                node={node}
              />
          )}
        />
        </View>
    </GestureHandlerRootView>
  );
}
