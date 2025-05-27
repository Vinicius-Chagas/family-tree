import { X } from '@/constants/consts';
import { ConnectorProcessor } from '@/hooks/connectorsProcessor';
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Connector } from 'relatives-tree/lib/types'; // Connector é [number, number, number, number]

interface Props {
  connectors: Array<Connector>;
}


export default React.memo<Props>(function Connectors({ connectors }) {
    const pad = X/2;

    const connectorProcessor = new ConnectorProcessor(connectors, pad, X);
    const processedConnectors = connectorProcessor.processConnectors();

    return (
        <Svg
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
        >
            {processedConnectors.map(({ linePath, arcAfterPath, arcBeforePath, color, idx }) =>(
                <React.Fragment key={`conn-group-${idx}`}>
                    {/* Linha principal do conector */}
                    <Path
                        d={linePath}
                        fill="none"
                        stroke={'black'}
                        strokeWidth={4}
                        strokeLinecap="round"
                    />
                    {/* Arco antes da linha (se existir) */}
                    {arcBeforePath && (
                        <Path
                            d={arcBeforePath}
                            fill="none"
                            stroke={'black'} // Mantido como no original, pode ser alterado para `color`
                            strokeWidth={4}
                            strokeLinecap="round"
                        />
                    )}
                    {/* Arco depois da linha (se existir) */}
                    {arcAfterPath && (
                        <Path
                            d={arcAfterPath}
                            fill="none"
                            stroke={'black'} // Mantido como no original, pode ser alterado para `color`
                            strokeWidth={4}
                            strokeLinecap="round"
                        />
                    )}
                </React.Fragment>
            ))}
            
        </Svg>
    );
});