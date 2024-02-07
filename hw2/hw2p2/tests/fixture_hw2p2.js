'use strict';

const chai = require('chai');
const { expect } = chai;

const { promisify } = require('util');
const isUrl = require('is-url');

const INTERPRETER = 'node';
const SCRIPT_TO_TEST = `${__dirname}/../hw2p2.js`;

const { ApiError, EntityNotFoundError } = require(SCRIPT_TO_TEST);

class Fixture {
  constructor() { 
    this.scriptToTest = SCRIPT_TO_TEST;
  }

  before() {
  }

  after() {
  }

  static async getAccessToken(clientId, clientSecret) {
    const { SpotifyApi } = require(SCRIPT_TO_TEST);

    return new Promise((resolve, reject) => {
      SpotifyApi.getAccessToken(clientId, clientSecret, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  uut(accessToken) {
    const { SpotifyApi } = require(SCRIPT_TO_TEST);

    return new SpotifyApi(accessToken);
  }

  _validator(expectError, expectData, cb) {
    return (err, data) => {
      if (!expectError) {
        expect(err).to.be.null;
      } else {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.equal(expectError);
      }

      if (!expectData) {
        expect(data).to.not.exist;
      } else {
        expect(data).to.exist;
        expect(data).to.equal(expectData);
      }

      cb();
    }
  }

  throw() {
    throw new Error('should not run');
  }

  // ENTITY HELPERS

  static assert_valid_album = (obj) => {
    const fields = [
      'albumId',
      'artists',
      'genres',
      'name',
      'imageUrl',
      'releaseDate',
      'tracks'
    ];
  
    for (const field of fields) {
      expect(obj).to.have.property(field);
    }

    // type-checks
    expect(obj.artists).to.be.an('array');
    for (const artist of obj.artists) {
      expect(artist).to.be.a.model('artist');
    }

    expect(obj.tracks).to.be.an('array');
    for (const track of obj.tracks) {
      expect(track).to.be.a.model('track');
    }

    obj.imageUrl && expect(obj.imageUrl).to.satisfy(isUrl);
  }

  static assert_valid_artist = (obj) => {
    const fields = [
      'artistId',
      'followers',
      'genres',
      'imageUrl',
      'name',
      'popularity'
    ];
  
    for (const field of fields) {
      expect(obj).to.have.property(field);
    }

    // type-checks
    obj.imageUrl && expect(obj.imageUrl).to.satisfy(isUrl);
  }

  static assert_valid_playlist = (obj) => {
    const fields = [
      'description',
      'followers',
      'playlistId',
      'imageUrl',
      'name',
      'owner',
      'public',
      'tracks'
    ];
  
    for (const field of fields) {
      expect(obj).to.have.property(field);
    }

    // type-checks
    expect(obj.tracks).to.be.an('array');
    for (const track of obj.tracks) {
      expect(track).to.be.a.model('track');
    }

    expect(obj.owner).to.be.a.model('user');

    obj.imageUrl && expect(obj.imageUrl).to.satisfy(isUrl);
  }

  static assert_valid_track = (obj) => {
    const fields = [
      'albumId',
      'artists',
      'durationMs',
      'trackId',
      'name',
      'popularity',
      'previewUrl'
    ];
  
    for (const field of fields) {
      expect(obj).to.have.property(field);
    }

    // type-checks
    expect(obj.artists).to.be.an('array');
    for (const artist of obj.artists) {
      expect(artist).to.be.a.model('artist');
    }

    obj.previewUrl && expect(obj.previewUrl).to.satisfy(isUrl);
  }

  static assert_valid_user = (obj) => {
    const fields = [
      'userId'
    ];
  
    for (const field of fields) {
      expect(obj).to.have.property(field);
    }
  }
}

chai.use(function (chai) {
  var Assertion = chai.Assertion;

  Assertion.addMethod('model', function (exp) {
    const self = this;

    const validators = {
      album:     Fixture.assert_valid_album,
      artist:    Fixture.assert_valid_artist,
      playlist:  Fixture.assert_valid_playlist,
      track:     Fixture.assert_valid_track,
      user:      Fixture.assert_valid_user
    }

    if (!(exp in validators)) {
      throw new Error(`invalid model assertion -- val:${exp}, allowed:${Object.keys(validators).join(',')}`);
    }

    validators[exp](self._obj);
  });
});

Fixture.scriptToTest = SCRIPT_TO_TEST;

module.exports = {
  Fixture,
  ApiError,
  EntityNotFoundError
}
