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

namespace notes.api.Controllers
{
    [Route("api/notes")]
    public class NotesController : Controller
    {
        private INotesRepository _notes;

        public NotesController(INotesRepository notes)
        {
            this._notes = notes;
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
        [HttpPatch("{id}")]
        public IActionResult PartiallyUpdateNote(int id, [FromBody] JsonPatchDocument<NoteForUpdateDto> patches)
        {
            // Patches check

            if (patches == null)
            {
                return BadRequest("Invalid patch format?");
            }

            if (ModelState.IsValid == false) // Validation of patches object! Not all NoteForUpdateDto!
            {
                return BadRequest(ModelState);
            }


            // Note to patch check

            Note note = _notes.GetSingleNote(id);

            if (note == null)
            {
                return NotFound();
            }


            // Maping Note entity to NoteForUpdateDto
            var noteForUpdateDto = Mapper.Map<NoteForUpdateDto>(note);

            // Patching
            patches.ApplyTo(noteForUpdateDto, ModelState);

            // Validation
            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }

            TryValidateModel(noteForUpdateDto); // Now ModelState applays to noteForUpdate not for patches

            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }

            Mapper.Map(noteForUpdateDto, note);

            if (_notes.Save() == false)
            {
                return StatusCode(500, "Can not save data.");
            }

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
