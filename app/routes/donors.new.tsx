import {
  Alert,
  Button,
  IconButton,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material"
import { Island, Sex } from "@prisma/client"
import { ActionFunction, LoaderFunction, json } from "@remix-run/node"
import { Form, useActionData, useLoaderData } from "@remix-run/react"
import { db } from "~/utils/db.server"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import React, { useEffect, useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import CloseIcon from "@mui/icons-material/Close"

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  let data = {
    firstName: form.get("firstName") as string,
    lastName: form.get("lastName") as string,
    idCard: form.get("idCard") as string,
    address: form.get("address") as string,
    sex: form.get("sex") as Sex,
    islandId: form.get("island") as string,
    dob: new Date(form.get("dob") as string),
    phoneNumber: form.get("phoneNumber") as string,
  }
  const newDonor = await db.donor.create({
    data: {
      address: data.address,
      dob: data.dob,
      firstName: data.firstName,
      idCard: data.idCard,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      sex: data.sex,
      islandId: parseInt(data.islandId),
    },
  })
  return json({ message: "Donor created successfully" })
  // return {}
}

export const loader: LoaderFunction = async ({ request }) => {
  const islands = await db.island.findMany()
  return json(islands)
}

export default function NewDonor() {
  const islands = useLoaderData<typeof loader>()
  const actionData = useActionData<{ message: string }>()
  console.log({ actionData })
  const [value, setValue] = useState<Dayjs | null>(dayjs("2022-04-17"))
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (actionData?.message) {
      setOpen(true)
    }
  }, [actionData])

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return
    }

    setOpen(false)
  }

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  )

  return (
    <>
      <Form method="post" className="flex flex-col gap-4">
        <TextField required type="text" label="First Name" name="firstName" />
        <TextField required type="text" label="Last Name" name="lastName" />
        <TextField required type="text" label="ID Card" name="idCard" />
        <TextField required type="text" label="Address" name="address" />

        <TextField
          id="select"
          defaultValue="MALE"
          required
          name="sex"
          label="Sex"
          select
        >
          <MenuItem value="MALE">Male</MenuItem>
          <MenuItem value="FEMALE">Female</MenuItem>
        </TextField>
        <TextField
          id="select"
          defaultValue="1"
          required
          name="island"
          label="Island"
          select
        >
          {islands.map((island: Island) => (
            <MenuItem key={island.id} value={island.id}>
              {island.name}
            </MenuItem>
          ))}
        </TextField>
        <DatePicker
          label="Date of birth"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
        <input readOnly type="text" name="dob" hidden value={String(value)} />
        <TextField
          id="outlined-number"
          label="Phone Number"
          name="phoneNumber"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}",
          }}
        />
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Success! New donor added! Hurray!
        </Alert>
      </Snackbar>
    </>
  )
}
