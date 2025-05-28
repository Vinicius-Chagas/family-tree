import { X } from '@/constants/consts';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import calcTree from 'relatives-tree';
import { ExtNode, Node } from 'relatives-tree/lib/types';
import ContinuousConnector from './continuousConnector';
import { ZoomableScrollView } from './zoomableScrollView';

interface Props {
  nodes: ReadonlyArray<Node>;
  rootId: string;
  width: number;
  height: number;
  placeholders?: boolean;
  className?: string;
  renderNode: (node: ExtNode) => React.ReactNode;
}

export default React.memo<Props>(function ReactFamilyTree(props) {
  const data = calcTree(props.nodes, {
    rootId: props.rootId,
    placeholders: props.placeholders,
  });
  const width = data.canvas.width * X;
  const height = data.canvas.height * X;
  console.log({width, height})
  const memoizedConnectors = useMemo(() => [...data.connectors], [data.connectors]);
  return (
    <ZoomableScrollView contentHeight={height} contentWidth={width}>
      <View style={{ width , height, position: 'relative', borderColor: 'black', borderWidth: 1 }}>
        <ContinuousConnector connectors={memoizedConnectors}/>
        {data.nodes.map(props.renderNode)}
      </View>
    </ZoomableScrollView>
  );
});