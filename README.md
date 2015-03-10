# SYNOPSIS
Store encrypted values in a json file.

# USAGE
```bash
npm install pxx -g
```

## LIST ALL ITEMS
Provides a nice ascii table that shows the meta data for the contents
of the database.

```bash
pxx
```

```
┌─────────────────┬─────────────┬──────────────────┐
│ Key             │ Description │ Email            │
├─────────────────┼─────────────┼──────────────────┤
│ foobar          │ whatever    │ foobar@gmail.com │
├─────────────────┼─────────────┼──────────────────┤
│ instagram       │ foobar      │ paolo@async.ly   │
├─────────────────┼─────────────┼──────────────────┤
│ rd.io           │ music       │ paolo@gmail.com  │
├─────────────────┼─────────────┼──────────────────┤
│ reddit          │ crap        │ paolo@async.ly   │
├─────────────────┼─────────────┼──────────────────┤
│ speakerdeck.com │ slides      │ paolo@async.ly   │
├─────────────────┼─────────────┼──────────────────┤
│ typography.com  │ pretty      │ paolo@async.ly   │
└─────────────────┴─────────────┴──────────────────┘
```


## READ AN ITEM
Prompts you for the master password and then provides the decrypted data.

```bash
pxx <key>
```

## CREATE AN ITEM
Asks a series of questions about what you want to save to the database.

```bash
pxx --create
```

## DELETE AN ITEM
Completely remove an item from the database.

```bash
pxx --delete <key>
```

## UPDATE AN ITEM
To do... something like...
```
pxx --update <key>
```

# CONFIG
Create an `rc` file that points to a sync'd directory. The `columns` array
represents arbitrary fields that will be stored with the encrypted data.
They can help you describe the data and are displayed when listing the 
contents of the database.

```json
{
  "syncdir": "/Users/username/Google Drive/pxx",
  "algorithm": "aes-256-ctr",
  "columns": ["Key", "Description", "Email"]
}
```

