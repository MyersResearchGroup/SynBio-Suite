import { Accordion, Container, Text, Timeline, CopyButton, ActionIcon, Tooltip} from '@mantine/core'
import React, { useContext } from 'react'
import { usePanelProperty } from '../../../redux/hooks/panelsHooks'
import { PanelContext } from './CollectionPanel'
import ReactTimeAgo from 'react-time-ago'
import { RuntimeStatus } from '../../../runtimeStatus'
import { useSelector } from 'react-redux'

import { FaRegClipboard, FaClipboardCheck } from "react-icons/fa";
import { BsDisplay, BsQuestion } from "react-icons/bs"
import { IoEllipsisHorizontalSharp, IoCheckmarkSharp } from "react-icons/io5"
import { TbCloudDataConnection } from "react-icons/tb";
import { BsFileEarmarkCheckFill } from "react-icons/bs";
import { SiMicrogenetics } from "react-icons/si";
import { IoCloudUpload } from "react-icons/io5";
import { FaHourglassStart } from "react-icons/fa6";




import { IoMdClose } from "react-icons/io"
import { TiInputChecked } from "react-icons/ti"
import { AiOutlineDoubleRight } from "react-icons/ai"
import { BiRun } from "react-icons/bi"


export default function XDCTimeline() {

    const panelId = useContext(PanelContext)
    const [ status, setStatus ] = usePanelProperty(panelId, "runtimeStatus", false, false, RuntimeStatus.COMPLETED)
    const formValues = usePanelProperty(panelId, "formValues")

    const failureMessage = useSelector(state => state.failureMessage.message)

    const running = RuntimeStatus.running(status)
    const successful = RuntimeStatus.successful(status)
    const unsuccessful = RuntimeStatus.unsuccessful(status)

    const timelineNodes = [
        <Timeline.Item title="Pinging XDC" bullet={<TbCloudDataConnection />} key="pen">
            <Text color="dimmed" size="sm">Connecting to the Experimental Data Connector Server</Text>
        </Timeline.Item>,

        <Timeline.Item title="Validating Files" bullet={<BsFileEarmarkCheckFill />} key="pen">
            <Text color="dimmed" size="sm">Your files are being processed by the server</Text>
        </Timeline.Item>,

        <Timeline.Item title="Converting to SBOL" bullet={<SiMicrogenetics />} key="run">
            <Text color="dimmed" size="sm">Converting file content into SBOL</Text>
        </Timeline.Item>,

        <Timeline.Item title="Uploading to SynBioHub" bullet={<IoCloudUpload />} key="run">
        <Text color="dimmed" size="sm">Uploading experimental date to SynBioHub</Text>
        </Timeline.Item>,

        <Timeline.Item title="Uploading to Flapjack" bullet={<IoCloudUpload />} key="run">
        <Text color="dimmed" size="sm">Uploading experimental date to Flapjack</Text>
        </Timeline.Item>,

        <Timeline.Item title="Not Started" bullet={<FaHourglassStart />} key="not">
            <Text color="dimmed" size="sm">The process has not started yet</Text>
        </Timeline.Item>
    ]

    const nodesToShow = statusToNodesMap[status]?.map(nodeIndex => timelineNodes[nodeIndex])
    const activeNode = nodesToShow?.length - (running ? 1 : 0)

    return (
        status && nodesToShow ?
            <Container pt={15}>
                {/* {!running &&
                    <Title order={5} sx={lastRunTitleStyle}>Last Run</Title>} */}
                <Timeline
                    active={activeNode}
                    bulletSize={24}
                    lineWidth={2}
                // color={running ? 'blue' : successful ? 'green' : 'red'}
                >
                    {nodesToShow}

                    {running &&
                        <Timeline.Item bullet={<IoEllipsisHorizontalSharp />} key="dot" mb={40}>
                        </Timeline.Item>}

                    {successful &&
                        <Timeline.Item title="Completed" color="green" bullet={<IoCheckmarkSharp />} sx={pushTitleDownStyles} key="com">
                        </Timeline.Item>}

                    {unsuccessful &&
                        <Timeline.Item title= {
                            <Accordion styles={accordionStyles} transitionDuration={0}>
                                <Accordion.Item value="customization">
                                    <Accordion.Control><b style = {textStyle}>Failed</b></Accordion.Control>
                                        <Accordion.Panel>
                                            <CopyButton value={failureMessage} timeout={2000}>
                                            {({ copied, copy }) => (
                                            <Tooltip label={copied ? 'Copied' : 'Copy Message'} withArrow position="right">
                                                    <ActionIcon
                                                    mb = {5}  
                                                    style={!copied ? actionIconOpacity : null} 
                                                    variant='outline' color={copied ? 'teal' : 'gray'} 
                                                    onClick={copy}>
                                                        {copied ? <FaClipboardCheck size="1rem" /> : <FaRegClipboard size="1rem" />}
                                                    </ActionIcon>
                                            </Tooltip>
                                            )}
                                            </CopyButton>
                                            {failureMessage}
                                        </Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>} 

                            color="red" bullet={<IoMdClose />} sx={pushTitleDownStyles} key="fai">
                        </Timeline.Item>
                    }        
                </Timeline>
            </Container> :
            <></>
    )
}

const statusToNodesMap = {
    [RuntimeStatus.CONNECTED]: [0],
    [RuntimeStatus.VALIDATED]: [0, 1],
    [RuntimeStatus.CONVERSION]: [0, 1, 2],
    [RuntimeStatus.SBH_UPLOAD]: [0, 1, 2, 3],
    [RuntimeStatus.CANCELLED]: null,
    [RuntimeStatus.FAILED]: [0, 1, 2, 3],
    [RuntimeStatus.COMPLETED]: [0, 1, 2, 3],
}

const pushTitleDownStyles = theme => ({
    '& .mantine-Timeline-itemTitle': {
        transform: 'translateY(3px)', 
    
    }
})

const accordionStyles = theme => ({
    control: {
        paddingLeft: '0px',
        borderRadius: 4,
    },
    item: {
        transform: 'translateY(-17px) translateX(-8px)',
    },
    panel: {
        paddingTop: '0px'
    }
})

const actionIconOpacity = {
    borderColor: "rgba(255, 255, 255, .3)" 
}

const textStyle = {
    fontWeight: 500,
    marginLeft: "9px"
}
const lastRunTitleStyle = theme => ({
    marginBottom: 10,
    color: theme.other.inactiveColor
})