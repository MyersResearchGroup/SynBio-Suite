import { NumberInput, SegmentedControl, Group, Space } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDebouncedValue } from '@mantine/hooks'
import { useContext, useEffect } from 'react'
import { usePanelDocument } from '../../../state/hooks'
import InputWrapper from "./InputWrapper"
import { PanelContext } from './SimulatorPanel'


export const parameterMap = {
    simulationType: {
        label: "Simulation Type",
        default: "ode",
        options: {
            ode: 'ODE',
            hode: 'HODE',
            ssa: 'SSA',
            hssa: 'HSSA',
            dfba: 'DFBA',
            jode: 'JODE',
            jssa: 'JSSA'
        }
    },
    runs: {
        label: "Number of Runs",
        validation: nonNegativeInteger,
        default: 1,
    },
    initialTime: {
        label: "Initial Time",
        validation: nonNegativeInteger,
        default: 0,
    },
    stopTime: {
        label: "Stop Time",
        validation: nonNegativeInteger,
        default: 100,
    },
    outputTime: {
        label: "Output Time",
        validation: nonNegativeInteger,
        default: 0,
    },
    printInterval: {
        label: "Print Interval",
        validation: nonNegativeInteger,
        default: 10,
    },
    minTimeStep: {
        label: "Minimum Time Step",
        validation: nonNegativeInteger,
        default: 0,
    },
    maxTimeStep: {
        label: "Maximum Time Step",
        validation: nonNegativeInteger,
        default: 100000,
    },
    seed: {
        label: "Seed"
    },
}


export default function ParameterForm({ onValidation }) {

    const panelId = useContext(PanelContext)

    // set up state in global store and add default values
    const [formValues, setFormValues] = usePanelDocument(panelId, "data.formValues", true)

    // set up form using Mantine hook
    const form = useForm({
        initialValues: formValues || Object.fromEntries(
            Object.entries(parameterMap).map(
                ([param, data]) => [param, data.default]
            )
        ),
        validate: Object.fromEntries(
            Object.entries(parameterMap).map(
                ([param, data]) => [param, data.validation]
            )
        ),
    })

    // debounce form values
    const [debouncedFormValues] = useDebouncedValue(form.values, 150)

    // update global store when values change
    useEffect(() => {
        JSON.stringify(debouncedFormValues) != JSON.stringify(formValues) &&
            setFormValues(debouncedFormValues)

        // validate
        onValidation?.(form.validate())
    }, [debouncedFormValues])

    return (
        <form>
            <Space h="xl" />
            <InputWrapper required label={parameterMap.simulationType.label} >
                <SegmentedControl
                    data={Object.entries(parameterMap.simulationType.options).map(
                        ([value, label]) => ({ label, value })
                    )}
                    color="blue"
                    {...form.getInputProps('simulationType')}
                />
            </InputWrapper>
            <Space h="xl" />
            <Group grow sx={groupStyle}>
                <NumberInput required label={parameterMap.initialTime.label} placeholder="" {...form.getInputProps('initialTime')} />
                <NumberInput required label={parameterMap.stopTime.label} placeholder="" {...form.getInputProps('stopTime')} />
                <NumberInput required label={parameterMap.outputTime.label} placeholder="" {...form.getInputProps('outputTime')} />
            </Group>
            <Space h="lg" />
            <Group grow sx={groupStyle}>
                <NumberInput required label={parameterMap.minTimeStep.label} placeholder="" {...form.getInputProps('minTimeStep')} />
                <NumberInput required label={parameterMap.maxTimeStep.label} placeholder="" {...form.getInputProps('maxTimeStep')} />
            </Group>
            <Space h="lg" />
            {/* <Group grow>
                <NumberInput required step={0.01} precision={9} label="Absolute Error" placeholder="" {...form.getInputProps('abs_err')} />
                <NumberInput required step={0.01} precision={9} label="Relative Error" placeholder="" {...form.getInputProps('rel_err')} />
            </Group>
            <Space h="lg" /> */}
            <Group grow mb={40} sx={groupStyle}>
                <NumberInput required label={parameterMap.runs.label} placeholder="" {...form.getInputProps('runs')} />
                <NumberInput required label={parameterMap.printInterval.label} placeholder="" {...form.getInputProps('printInterval')} />
                <NumberInput label={parameterMap.seed.label} placeholder="Leave blank for random" {...form.getInputProps('seed')} />
            </Group>
        </form>
    )
}

const groupStyle = theme => ({
    alignItems: 'flex-start'
})

function nonNegativeInteger(value) {
    return !(Number.isInteger(value) && value >= 0) && "Must be a non-negative integer"
}