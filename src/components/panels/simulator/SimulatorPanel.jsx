import { Badge, ScrollArea, Space, Tabs } from '@mantine/core'
import AnalysisWizard from './AnalysisWizard'
import { createContext } from 'react'
import AnalysisResults from './AnalysisResults'
import PanelSaver from "../PanelSaver"
import StatusBadge from './StatusBadge'
import { usePanelDocument } from '../../../modules/state/hooks'


export const PanelContext = createContext()

const TabValues = {
    SETUP: "setup",
    RESULTS: "results"
}


export default function SimulatorPanel({ id }) {

    const resultLength = usePanelDocument(id, doc => doc && Object.keys(doc.data.results || {}).length)

    return (
        <PanelContext.Provider value={id}>
            <StatusBadge />
            <Tabs defaultValue={TabValues.SETUP} styles={tabStyles}>
                <Tabs.List>
                    <Tabs.Tab value={TabValues.SETUP}>Setup</Tabs.Tab>
                    {resultLength && <Tabs.Tab value={TabValues.RESULTS}>
                        Results
                        <Badge ml={10}>{resultLength}</Badge>
                    </Tabs.Tab>}
                </Tabs.List>
                <Tabs.Panel value={TabValues.SETUP}>
                    <ScrollArea style={{ height: 'calc(100vh - 93px)' }}>
                        <AnalysisWizard />
                        <Space h={20} />
                    </ScrollArea>
                </Tabs.Panel>
                <Tabs.Panel value={TabValues.RESULTS}>
                    <AnalysisResults />
                </Tabs.Panel>
            </Tabs>
            <PanelSaver id={id} />
        </PanelContext.Provider>
    )
}

const tabStyles = theme => ({
    tab: {
        width: 120,
        textTransform: 'uppercase',
        fontWeight: 600
    },
    tabsList: {
        // backgroundColor: theme.colors.dark[6]
    }
})