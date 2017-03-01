using Microsoft.AspNetCore.Mvc;
using notes.api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.JsonPatch;
using notes.api.Services;
using AutoMapper;
using notes.api.Entities;
using Microsoft.Extensions.Logging;

namespace notes.api.Controllers
{
    [Route("api/notes")]
    public class NotesController : Controller
    {
        private INotesRepository _notes;
        readonly ILogger<NotesController> _log;

        public NotesController(INotesRepository notes, ILogger<NotesController> log)
        {
            this._notes = notes;
            this._log = log;

            _log.LogInformation("NotesController created");
        }



        [HttpGet("{parentId}/children")]
        public IActionResult GetChildren(int parentId)
        {
            if ((parentId > 0) && _notes.GetSingleNote(parentId) == null)
            {
                return BadRequest();      
            }

            IEnumerable<Note> notes = _notes.GetChildren(parentId);

            var notesDto = Mapper.Map<IEnumerable<Note>>(notes); // TODO: W rezie błędu null czy exception?

            return Ok(notesDto);
        }

        [HttpGet("{id}", Name = "GetNote")]
        public IActionResult GetSingleNote(int id)
        {
            Note note = _notes.GetSingleNote(id);

            if (note == null) return NotFound();

            NoteDto noteDto = Mapper.Map<NoteDto>(note); // TODO: W rezie błędu null czy exception?

            return Ok(noteDto);
        }

        [HttpPost()]
        public IActionResult CreateNote([FromBody] NoteForCreationDto noteForCreationDto)
        {
           if (noteForCreationDto == null)
            {
                return BadRequest();
            }

            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }
               
            Entities.Note note = Mapper.Map<Note>(noteForCreationDto);

            int id = _notes.AddChildren(note);

            return CreatedAtRoute("GetNote", new { id = id }, note);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id">Id of note to patch</param>
        /// <param name="patches">
        /// [{ "op": "replace",	"path": "/title", "value": "new value" }]
        /// </param>
        /// <returns></returns>
        [HttpPost("{id}")] // HttpPatch DOES NOT WORK AT SERVER!!!
        public IActionResult PartiallyUpdateNote(int id, [FromBody] JsonPatchDocument<NoteForUpdateDto> patches)
        {
            _log.LogInformation("Partial update of #{0}. Patches: {1}", id, patches);
            // Patches check

            if (patches == null)
            {
                _log.LogError("Invalid patch format");
                return BadRequest("Invalid patch format?");
            }

            if (ModelState.IsValid == false) // Validation of patches object! Not all NoteForUpdateDto!
            {
                _log.LogError("Invalid patch state");
                return BadRequest(ModelState);
            }


            // Note to patch check

            Note note = _notes.GetSingleNote(id);

            if (note == null)
            {
                _log.LogError("Note to patch not found");
                return NotFound();
            }


            // Maping Note entity to NoteForUpdateDto
            var noteForUpdateDto = Mapper.Map<NoteForUpdateDto>(note);

            // Patching
            patches.ApplyTo(noteForUpdateDto, ModelState);

            // Validation
            if (ModelState.IsValid == false)
            {
                _log.LogError("NoteForUpdateDto not valid after patches applay");
                return BadRequest(ModelState);
            }

            TryValidateModel(noteForUpdateDto); // Now ModelState applays to noteForUpdate not for patches

            if (ModelState.IsValid == false)
            {
                _log.LogError("Model not valid");
                return BadRequest(ModelState);
            }

            Mapper.Map(noteForUpdateDto, note);

            if (_notes.Save() == false)
            {
                _log.LogError("Can not save data");
                return StatusCode(500, "Can not save data.");
            }

            _log.LogInformation("Patches applayed");
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteNote(int id)
        {
            if (_notes.DeleteNote(id))
            {
                return NoContent();
            }
            else
            {
                return NotFound();
            }
        }
    }
}
