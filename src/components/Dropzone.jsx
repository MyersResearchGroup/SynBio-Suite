import { useState, useEffect } from "react"
import { Center, Title, Text, Group, useMantineTheme, ActionIcon } from "@mantine/core"

import { CgCheckO } from "react-icons/cg"
import { AiOutlineSmile } from "react-icons/ai"
import { IoClose } from "react-icons/io5"


export default function Dropzone({ children, allowedTypes, item, onItemChange }) {

    const theme = useMantineTheme()

    // controls look of dropzone -- true, false, or nullish
    const [allowedToDrop, setAllowedToDrop] = useState()

    // drag handlers 

    const handleDragLeave = event => {
        setAllowedToDrop(null)
    }

    const handleDragOver = event => {
        event.preventDefault()  // necessary for allowing a drag
        event.dataTransfer.dropEffect = "link"

        const itemType = event.dataTransfer.types
            .find(key => key.startsWith('type:'))
            .replace('type:', '')

        // check if this item is allowed in this dropzone
        setAllowedToDrop(!allowedTypes || allowedTypes.map(at => at.toLowerCase()).includes(itemType))
    }

    const handleDrop = event => {
        allowedToDrop && onItemChange?.(event.dataTransfer.getData("documentId") || event.dataTransfer.getData("name"))
        setAllowedToDrop(null)
    }

    return (
        item ?
            <Center sx={successStyles.container} >
                <CgCheckO style={successStyles.icon(theme)} />
                <Title order={3} sx={successStyles.title}>{item}</Title>
                <ActionIcon sx={successStyles.removeIcon} onClick={() => onItemChange(null)} ><IoClose /></ActionIcon>
            </Center> :
            <Center
                sx={containerStyle(allowedToDrop)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {allowedToDrop == null ?
                    <Title order={3} sx={titleStyle}>{children}</Title> :
                    allowedToDrop ?
                        <Text sx={iconStyle}><AiOutlineSmile /></Text> :
                        <Title order={3} sx={errorTitleStyle}>Item not allowed</Title>}
            </Center>
    )
}

const successStyles = {
    container: theme => ({
        padding: "20px 30px",
        margin: "20px auto",
        width: "80%",
        borderRadius: 15,
        border: "3px solid " + theme.colors.green[6]
    }),
    icon: theme => ({
        color: theme.colors.green[6],
        fontSize: 22,
    }),
    title: theme => ({
        color: theme.colors.green[6],
        fontWeight: 600,
        marginLeft: 10
    }),
    removeIcon: theme => ({
        color: theme.other.inactiveColor,
        fill: theme.other.inactiveColor,
        fontSize: 20,
        marginLeft: 'auto',
        '&:hover': {
            color: theme.colors.red[5],
            fill: theme.colors.red[5],
        }
    })
}

const errorTitleStyle = theme => ({
    color: theme.colors.red[5],
    fontWeight: 600
})

const titleStyle = theme => ({
    color: theme.colors.dark[3],
    fontWeight: 600
})

const containerStyle = allowedToDrag => theme => ({
    padding: "60px 0",
    margin: "20px auto",
    width: "80%",
    borderRadius: 15,
    ...(allowedToDrag == null ?
        {
            border: "3px dashed " + theme.colors.dark[4]        // neutral case
        } :
        allowedToDrag ?
            {
                border: "3px dashed " + theme.colors.blue[6],    // good case
                padding: "50px 0"
            } :
            {
                border: "3px dashed " + theme.colors.red[6]     // bad case
            })
})

const iconStyle = theme => ({
    color: theme.colors.blue[6],
    fontSize: 30
})