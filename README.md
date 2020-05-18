# graphql-playground-server
A simple HTTP server that serves a web-based [GraphQL Playground][1].

## Rationale
GraphQL Playground is nice, but it would be even nicer if you could easily host
it in a stanadlone web server. This would keep it completely separate from your
API processes and repositories, simplifying your dependency trees and just
generally making more sense than embedding it inside your apps with middleware
which you turn off in production.

There does not seem to be a package on npm for doing this yet, however, even
though it would be dead simple to make. So, we're making it here. :)

## Installation

### As a Local Service
Ideally you want to install as a service, so that the server is always running
when your machine is on.

#### MacOS (with Homebrew)
```sh
brew tap batterii/graphql-playground-server

brew install graphql-playground-server

brew services start graphql-playground-server
```

#### Updates
This project will likely not be updated much, but if we do put out a new
version and you want to upgrade, you can use the usual Homebrew commands to do
so:

```sh
brew update

brew upgrade graphql-playground-server

brew services restart graphql-playground-server
```


#### Debian
I am not a Debian expert by any means and I don't have a ton of time to become
one, so as far as releasing this as an easily-installed package goes, this is
kind of the best I can do for now. If there are any Debian packaging gurus out
there who might like to lend a hand, feel free.

Starting with v0.1.6, you can find a `deb` package under Assets for each release
in the Releases tab. Find the latest one and download it to your machine, along
with the associated `pubkey.gpg`.

Signing of individual packages is kind of a mess in Debian, it seems, but we're
doing it anyway for those responsible folks who want peace of mind before using
`sudo` to install this thing. Packages are signed with [dpkg-sig][2]. If you
don't have it already, install it from the official Debian repository like so:

```
sudo apt install dpkg-sig
```

Next, you should add the public key to your gnupg public keychain:

```
gpg --import ~/Downloads/pubkey.gpg
```

We won't be changing this public key for most releases, so if you've already
added this key your keychan, the `gpg` tool will let you know. Once you have it
in place, you can check the package's signature like so:

```
dpkg-sig --verify ~/Downloads/graphql-playground-server_0.1.6_all.deb
```

This command will print, among other things, `GOODSIG _gpgoriginl` into your
console if the signature checks out. If it does *not* check out you will see
`BADSIG _gpgoriginl` or `NOSIG` instead, depending on whether the signature is
bad or simply not present due to tampering.

Again, I'm sure there is a much better way of doing this stuff, but it seems to
be some kind of arcane art and I'm not in a position to learn it right now.


Once you've verified the signature, you can safely install like so:

```
sudo apt install ~/Downloads/graphql-playground-server_0.1.6_all.deb
```

You'll of course want to change the version number in that filename to match the
one you are installing.

The service should start automatically once installed, but if you want to
control it, use your system's service manager which-- if you aren't using an
old or heavily customized Debian version-- is likely `systemd`:

```
# Check status
systemctl status graphql-playground-server

# Start
sudo systemctl start graphql-playground-server

# Stop
sudo systemctl stop graphql-playground-server

# Restart
sudo systemctl restart graphql-playground-server

```

##### Updates
This project will likely not be updated much, so I'm not
bothering with trying to get together a repository for publishing `.changes` and
stuff like that. If you need to install a new version, just remove the one you
have:

```
sudo apt remove graphql-playground-server
```

Then install the new one, downloaded and verified the same way as above.


### NPM Global Install
If for whatever reason you can't or would rather not install as a service, you
can install globally with npm:

```sh
npm i -g graphql-playground-server
```

Once installed you can run the server in a console like so:

```
graphql-playground-server
```


## Using the Playground
By default, you can access the playground while it is running at
[http://localhost:3001](http://localhost:3001). It will send its GraphQL
requests to `https://localhost:3000/graphql`, though you can change this address
using the address bar in the playground itself.

The server's port number and default GraphQL endpoint can be configured as
described below.

## Configuration

### Config Files
Configuration files for this server are simple yaml and only support two
properties: `port` and `endpoint`.

**graphql-playground-server.conf.yaml**
```yaml
port: 3002 # Changes the server's port number.
endpoint: https://your.host/graphql # Changes the url for graphql requests.
```

You can reference a config file when running the server like so:

```sh
graphql-playground-server --config  graphql-playground-server.conf.yaml
```

### MacOS Service
The service installed by the Homebrew formula looks for a configuration file at
`HOMEBREW_PREFIX/etc/graphql-playground-server.conf.yaml`. `HOMEBREW_PREFIX` is
typically `/usr/local`, but this may vary if you installed Homebrew differently
than usual.

To configure the service, simply create this file and populate it with your yaml
configuration as above. Once your configuration is in place, you just need to
restart the service to use it:

```
brew services restart graphql-playground-server
```

#### Debian Service
The service installed by the `deb` package looks for a configration file at
`/etc/graphql-playground-server/graphql-playground-server.conf.yaml`. This file
will not exist by default, though its parent directory will.

To configure the service, simply create this file and populate it with your
yaml configuration as above. Once your configuration is in place, you just need
to restart the service to use it:

```
sudo systemctl restart graphql-playground-server
```


### Other Configuration Methods
In addition to using a config file, you can provide command-line arguments:

```sh
graphql-playground-server --port 3002 --endpoint https://your.host/graphql
```

You can also provide environment variables:

```sh
GRAPHQL_PLAYGROUND_PORT=3002 GRAPHQL_PLAYGROUND_ENDPOINT=https://your.host/graphql graphql-playground-server
```

If you provide the same configuration option in multiple ways, they will be
prioritized like so:

1. CLI args
2. config file values
3. environment variables


## For Developers
The Homebrew tap for this project is completely managed inside its [own git
repo][3] and was creating according to the guidelines described [here][4].

As for the Debian package, it is built using [node-deb][5]. I had attempted to
keep any packaging stuff out of this repository, but `node-deb` is rather
finicky in how it is configured so I kind of just gave up and put it in this
repo directly.

To build a package file, just run this:

```
npm run deb
```

The created package can then be signed with a secret GPG in your keyring like
so-- assuming you have `dpkg-sig` installed:


```
dpkg-sig -k <your_key_id> --sign origin <new_package_path>
```

This will alter the package file, adding the signature in place. You should then
use GitHub's UI to add the signed package and the public key to your release.

Of course, to produce a signature that can be checked against the public key
we're already using, you would need the associated private key, which I do not
plan on sharing, at least not until I know more about how this crap works. So if
you really need to do a new release yourself, make your own new key pair like
so:

```
gpg --gen-key
```

And export the public key to a file like so:

```
gpg --output pubkey.gpg --armor export <your_email_address>
```

Now you can sign the package as above, then add the signed package and your
exported public key to your Release using GitHub's UI. If you do this, though,
make sure to make a note of the public key change in the release notes, just to
warn anybody who might updates and tries verifying the signature with the same
key as before.

I'd like to have a better system for key management in place to make it easier
for more people to work on this... but also I doubt anybody in our company is
ever going to change this library but me, so I'm not worried about it for now.
:)


[1]: https://github.com/prisma-labs/graphql-playground
[2]: https://manpages.debian.org/jessie/dpkg-sig/dpkg-sig.1.en.html
[3]: https://github.com/Batterii/homebrew-graphql-playground-server
[4]: https://docs.brew.sh/Node-for-Formula-Authors
[5]: https://www.npmjs.com/package/node-deb
