use neon::prelude::*;
// use keyring::{Entry, Result};
use keyring::{Entry};

// Get the secret for the given service and account
fn getSecret(mut cx: FunctionContext) -> JsResult<JsString> {
    let service = cx.argument::<JsString>(0)?.value();
    let account = cx.argument::<JsString>(1)?.value();
    let entry = Entry::new(service, account)?;
    let password = entry.get_password()?;
    Ok(password);
}

// Set the secret for the given service and account
fn setSecret(mut cx: FunctionContext) -> JsResult<JsString> {
    let service = cx.argument::<JsString>(0)?.value();
    let account = cx.argument::<JsString>(1)?.value();
    let secret = cx.argument::<JsString>(2)?.value();
    let entry = Entry::new(service, account)?;
    let password = entry.set_password(secret)?;
    Ok(password);
}

// Delete the secret for the given service and account
fn deleteSecret(mut cx: FunctionContext) -> JsResult<JsString> {
    let service = cx.argument::<JsString>(0)?.value();
    let account = cx.argument::<JsString>(1)?.value();
    let entry = Entry::new(service, account)?;
    let password = entry.delete_password()?;
    Ok(password);
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("getSecret", getSecret)?;
    cx.export_function("setSecret", setSecret)?;
    cx.export_function("deleteSecret", deleteSecret)?;
    Ok(())
}
